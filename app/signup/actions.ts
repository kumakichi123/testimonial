'use server'

import { type CookieOptions, createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const slugify = (text: string): string =>
  text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')

const cuid = (): string => {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).slice(2, 8)
  return `${timestamp}${random}`
}

export async function signUp(formData: FormData): Promise<{ message?: string; error?: string }> {
  const email = (formData.get('email') as string | null)?.trim() ?? ''
  const password = (formData.get('password') as string | null) ?? ''
  const companyName = (formData.get('companyName') as string | null)?.trim() ?? ''

  if (!email || !password || !companyName) {
    return { error: '必要な項目が入力されていません。' }
  }

  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  const {
    data: { user },
    error: signUpError,
  } = await supabase.auth.signUp({
    email,
    password,
  })

  if (signUpError) {
    return { error: signUpError.message }
  }

  if (!user) {
    return { error: 'ユーザーを作成できませんでした。' }
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const slugBase = slugify(companyName) || cuid()
  const iframeToken = cuid()

  let company: any = null
  let companyError: { message?: string; code?: string } | null = null
  let slug = slugBase

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const result = await supabaseAdmin
      .from('companies')
      .insert({
        name: companyName,
        slug,
        iframe_token: iframeToken,
      })
      .select('*')
      .single()

    if (!result.error && result.data) {
      company = result.data
      companyError = null
      break
    }

    companyError = result.error

    if (
      companyError &&
      (companyError.code === '23505' ||
        companyError.message?.toLowerCase().includes('duplicate key value'))
    ) {
      slug = `${slugBase}-${cuid().slice(-4)}`
      continue
    }

    break
  }

  if (!company) {
    await supabaseAdmin.auth.admin.deleteUser(user.id)
    return { error: companyError?.message ?? '会社の作成に失敗しました。' }
  }

  const { error: membershipError } = await supabaseAdmin
    .from('memberships')
    .insert({
      company_id: company.id,
      user_id: user.id,
      role: 'admin',
    })

  if (membershipError) {
    await supabaseAdmin.from('companies').delete().eq('id', company.id)
    await supabaseAdmin.auth.admin.deleteUser(user.id)
    return { error: membershipError.message }
  }

  const { error: formError } = await supabaseAdmin.from('forms').insert({
    company_id: company.id,
    slug: cuid(),
  })

  if (formError) {
    await supabaseAdmin.from('memberships').delete().eq('company_id', company.id).eq('user_id', user.id)
    await supabaseAdmin.from('companies').delete().eq('id', company.id)
    await supabaseAdmin.auth.admin.deleteUser(user.id)
    return { error: formError.message }
  }

  const trialLengthDays = 7
  const trialEndsAt = new Date(Date.now() + trialLengthDays * 24 * 60 * 60 * 1000).toISOString()
  const standardPriceId = process.env.STRIPE_STANDARD_PRICE_ID ?? null

  const { error: trialError } = await supabaseAdmin
    .from('companies')
    .update({
      subscription_status: 'trialing',
      subscription_price_id: standardPriceId,
      stripe_subscription_id: null,
      trial_ends_at: trialEndsAt,
    })
    .eq('id', company.id)

  if (trialError) {
    console.error('Failed to start trial for company', trialError)
  }

  return { message: '確認メールを送信しました。メールボックスをご確認ください。' }
}
