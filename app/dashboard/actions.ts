'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { getStripe } from '@/lib/stripe';

export type InviteMemberState =
  | { status: 'idle' }
  | { status: 'success'; message: string }
  | { status: 'error'; message: string };

export const inviteMemberInitialState: InviteMemberState = { status: 'idle' };

export async function inviteMember(
  _prevState: InviteMemberState,
  formData: FormData,
): Promise<InviteMemberState> {
  const email = (formData.get('email') as string | null)?.trim().toLowerCase();
  const role = (formData.get('role') as string | null)?.trim().toLowerCase() || 'member';
  const companyId = (formData.get('companyId') as string | null)?.trim();

  if (!email || !companyId) {
    return { status: 'error', message: 'メールアドレスを入力してください。' };
  }

  if (!['admin', 'editor', 'member'].includes(role)) {
    return { status: 'error', message: '指定された権限は利用できません。' };
  }

  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
      },
    },
  );

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { status: 'error', message: 'もう一度サインインしてから操作してください。' };
  }

  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data: currentMembership, error: membershipLookupError } = await adminClient
    .from('memberships')
    .select('role')
    .eq('company_id', companyId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (membershipLookupError) {
    return { status: 'error', message: membershipLookupError.message };
  }

  if (!currentMembership || currentMembership.role !== 'admin') {
    return { status: 'error', message: '招待できるのは管理者のみです。' };
  }

  let invitedUserId: string | null = null;

  const { data: inviteData, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(
    email,
    {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/login`,
    },
  );

  if (inviteError) {
    if (inviteError.message.toLowerCase().includes('already registered')) {
      const { data: existingUsers, error: listError } = await adminClient.auth.admin.listUsers();
      if (listError) {
        return { status: 'error', message: listError.message };
      }
      invitedUse
        existingUsers.users.find((candidate) => candidate.email?.toLowerCase() === email)?.id ?? null;
      if (!invitedUserId) {
        return {
          status: 'error',
          message: '既に登録済みのユーザーを特定できませんでした。',
        };
      }
    } else {
      return { status: 'error', message: inviteError.message };
    }
  } else {
    invitedUserId = inviteData?.user?.id ?? null;
  }

  if (!invitedUserId) {
    return { status: 'error', message: '招待先ユーザーの特定に失敗しました。' };
  }

  const { data: existingMembership } = await adminClient
    .from('memberships')
    .select('id')
    .eq('company_id', companyId)
    .eq('user_id', invitedUserId)
    .maybeSingle();

  if (existingMembership) {
    return { status: 'error', message: 'このユーザーはすでにメンバーとして登録されています。' };
  }

  const { error: insertError } = await adminClient.from('memberships').insert({
    company_id: companyId,
    user_id: invitedUserId,
    role,
  });

  if (insertError) {
    return { status: 'error', message: insertError.message };
  }

  revalidatePath('/dashboard');

  return { status: 'success', message: '招待メールを送信し、メンバー候補に追加しました。' };
}

type StripeActionResult =
  | { status: 'success'; url: string }
  | { status: 'error'; message: string };

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
const STANDARD_PRICE_ID = process.env.STRIPE_STANDARD_PRICE_ID;

async function resolveCompanyForUser() {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'もう一度サインインしてから操作してください。' } as const;
  }

  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data: membership, error } = await adminClient
    .from('memberships')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    return { error: error.message } as const;
  }

  if (!membership?.company) {
    return { error: '所属する会社が見つかりませんでした。' } as const;
  }

  if (membership.role !== 'admin') {
    return { error: '購読プランの管理は管理者のみが実行できます。' } as const;
  }

  return {
    company: membership.company,
  } as const;
}

export async function createStandardCheckoutSession(): Promise<StripeActionResult> {
  if (!STANDARD_PRICE_ID) {
    return { status: 'error', message: 'STRIPE_STANDARD_PRICE_ID が設定されていません。' };
  }

  const result = await resolveCompanyForUser();
  if ('error' in result) {
    return { status: 'error', message: result.error };
  }

  try {
    const stripe = getStripe();
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    let customerId: string | null = result.company.stripe_customer_id ?? null;

    if (!customerId) {
      const customer = await stripe.customers.create({
        metadata: {
          company_id: result.company.id,
        },
        name: result.company.name ?? undefined,
      });
      customerId = customer.id;

      await adminClient
        .from('companies')
        .update({
          stripe_customer_id: customerId,
        })
        .eq('id', result.company.id);
    }

    const trialDays = 7;
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      success_url: `${APP_URL}/dashboard?upgrade=success`,
      cancel_url: `${APP_URL}/dashboard?upgrade=cancelled`,
      payment_method_collection: 'if_required',
      line_items: [
        {
          price: STANDARD_PRICE_ID,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: trialDays,
        metadata: {
          company_id: result.company.id,
        },
      },
      metadata: {
        company_id: result.company.id,
      },
      allow_promotion_codes: false,
    });

    await adminClient
      .from('companies')
      .update({
        subscription_price_id: STANDARD_PRICE_ID,
        subscription_status: 'trialing',
        trial_ends_at: new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000).toISOString(),
      })
      .eq('id', result.company.id);

    if (!session.url) {
      throw new Error('StripeセッションURLが生成されませんでした。');
    }

    return { status: 'success', url: session.url };
  } catch (error) {
    console.error('[stripe] checkout session error', error);
    return { status: 'error', message: 'Stripe の設定情報を確認してください。' };
  }
}

export async function createBillingPortalSession(): Promise<StripeActionResult> {
  const result = await resolveCompanyForUser();
  if ('error' in result) {
    return { status: 'error', message: result.error };
  }

  if (!result.company.stripe_customer_id) {
    return { status: 'error', message: 'まだ購読が開始されていません。' };
  }

  try {
    const stripe = getStripe();

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: result.company.stripe_customer_id,
      return_url: `${APP_URL}/dashboard`,
    });

    return { status: 'success', url: portalSession.url };
  } catch (error) {
    console.error('[stripe] portal session error', error);
    return { status: 'error', message: '請求ポータルの作成に失敗しました。Stripe 設定を確認してください。' };
  }
}
