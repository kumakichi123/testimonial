"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type ReactNode,
  type SVGProps,
} from "react";
import { useFormState } from "react-dom";
import {
  inviteMember,
  inviteMemberInitialState,
  createStandardCheckoutSession,
  createBillingPortalSession,
} from "./actions";

const TABS = [
  { id: "ai", label: "AI整形結果" },
  { id: "raw", label: "アンケート原文" },
  { id: "share", label: "共有" },
  { id: "settings", label: "設定" },
] as const;

type ResponseRecord = {
  name?: string | null;
  content?: string | null;
  rating?: number | null;
  created_at?: string | null;
};

type TestimonialRecord = {
  id: string;
  ai_headline?: string | null;
  ai_body?: string | null;
  is_public?: boolean | null;
  responses?: ResponseRecord | null;
};

type MemberRecord = {
  id: string;
  email?: string | null;
  role?: string | null;
  status: "pending" | "active";
  joinedAt?: string | null;
};

const ROLE_LABELS: Record<string, string> = {
  admin: "管理者",
  editor: "編集者",
  member: "メンバー",
};

const STATUS_LABELS: Record<MemberRecord["status"], string> = {
  pending: "招待中",
  active: "参加済み",
};

const MAX_RATING = 5;
const STAR_SOURCE = "★★★★★";

function clsx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function clampRating(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(MAX_RATING, Math.round(value)));
}

function StarDisplay({ rating }: { rating?: number | null }) {
  if (typeof rating !== "number") return null;
  const safe = clampRating(rating);
  const filled = STAR_SOURCE.slice(0, safe);
  const empty = STAR_SOURCE.slice(safe, MAX_RATING);
  return (
    <span className="inline-flex items-center text-xs font-semibold text-amber-500">
      <span>{filled}</span>
      {empty ? <span className="text-slate-300">{empty}</span> : null}
      <span className="ml-2 text-[11px] font-medium text-slate-400">
        ({rating.toFixed(1)})
      </span>
    </span>
  );
}

function formatDisplayDate(value?: string | null) {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return undefined;
  return new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium" }).format(date);
}

function toIsoDate(value?: string | null) {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return undefined;
  return date.toISOString().split("T")[0];
}

function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-white/70 p-12 text-center shadow-inner">
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}

function CopyButton({
  text,
  label,
  copiedLabel = "コピー済み",
}: {
  text: string;
  label: string;
  copiedLabel?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function handleCopy() {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={clsx(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition",
        copied
          ? "border-emerald-500 bg-emerald-500 text-white shadow-sm"
          : "border-slate-200 bg-white/90 text-slate-600 shadow-sm hover:border-sky-200 hover:text-sky-600"
      )}
      aria-live="polite"
    >
      <span>{copied ? copiedLabel : label}</span>
      {copied ? <span aria-hidden="true">✓</span> : null}
    </button>
  );
}

function SettingsSection({
  title,
  description,
  open,
  onToggle,
  children,
}: {
  title: string;
  description?: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-100 bg-white/80 shadow-sm shadow-sky-50">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          {description ? (
            <p className="mt-1 text-xs text-slate-500">{description}</p>
          ) : null}
        </div>
        <span className="text-lg font-semibold text-slate-400" aria-hidden="true">
          {open ? "−" : "+"}
        </span>
      </button>
      {open ? <div className="border-t border-slate-100 px-5 py-5">{children}</div> : null}
    </section>
  );
}

function IframePreview({ src, version }: { src: string; version: number }) {
  const [loaded, setLoaded] = useState(false);
  const previewUrl = useMemo(() => buildPreviewUrl(src, version), [src, version]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-inner">
      {!loaded ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center gap-3 bg-white/75 backdrop-blur-sm">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-sky-400" />
          <span className="text-sm font-medium text-slate-600">読み込み中...</span>
        </div>
      ) : null}
      <iframe
        key={previewUrl}
        src={previewUrl}
        title="testimonial-preview"
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className="h-[420px] w-full border-0 bg-white"
      />
    </div>
  );
}

function buildPreviewUrl(base: string, version: number) {
  const separator = base.includes("?") ? "&" : "?";
  return `${base}${separator}preview=${version}`;
}

function PencilIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="m4.5 12.5-.5 3 3-.5 7.207-7.207a1 1 0 0 0 0-1.414L12.621 4.5a1 1 0 0 0-1.414 0Z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="m4.5 10 3.5 3.5L15.5 6"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="m6 6 8 8m0-8-8 8"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path d="M10 4v12m6-6H4" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MinusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path d="M16 10H4" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AiTestimonialCard({ testimonial }: { testimonial: TestimonialRecord }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const rawHeadline = testimonial.ai_headline?.trim() ?? "";
  const rawBody = testimonial.ai_body?.trim() ?? "";
  const [currentHeadline, setCurrentHeadline] = useState(rawHeadline);
  const [currentBody, setCurrentBody] = useState(rawBody);
  const [headlineDraft, setHeadlineDraft] = useState(rawHeadline);
  const [bodyDraft, setBodyDraft] = useState(rawBody);
  const [isEditing, setIsEditing] = useState(false);
  const [hasValidationError, setHasValidationError] = useState(false);
  const [hasSaveError, setHasSaveError] = useState(false);
  const [isSaving, startSaving] = useTransition();

  const name = testimonial.responses?.name?.trim() || "匿名";
  const rating = testimonial.responses?.rating;
  const createdAt = formatDisplayDate(testimonial.responses?.created_at);
  const statusLabel = testimonial.is_public ? "公開中" : "非公開";
  const statusClasses = testimonial.is_public
    ? "bg-emerald-50 text-emerald-600 ring-emerald-100"
    : "bg-slate-100 text-slate-500 ring-slate-200";

  const displayHeadline = currentHeadline || "見出し未生成";
  const displayBody = currentBody || "本文がまだありません";

  useEffect(() => {
    if (!isEditing) {
      setCurrentHeadline(rawHeadline);
      setCurrentBody(rawBody);
      setHeadlineDraft(rawHeadline);
      setBodyDraft(rawBody);
    }
  }, [rawHeadline, rawBody, isEditing]);

  const handleStartEditing = () => {
    setHeadlineDraft(currentHeadline);
    setBodyDraft(currentBody);
    setHasValidationError(false);
    setHasSaveError(false);
    setIsEditing(true);
    setIsExpanded(true);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setHeadlineDraft(currentHeadline);
    setBodyDraft(currentBody);
    setHasValidationError(false);
    setHasSaveError(false);
  };

  const handleToggleExpand = () => {
    if (isEditing) return;
    setIsExpanded((prev) => !prev);
  };

  const handleSave = () => {
    const trimmedHeadline = headlineDraft.trim();
    const trimmedBody = bodyDraft.trim();
    if (!trimmedHeadline || !trimmedBody) {
      setHasValidationError(true);
      return;
    }

    const payload = new FormData();
    payload.append("ai_headline", trimmedHeadline);
    payload.append("ai_body", trimmedBody);

    setHasValidationError(false);
    setHasSaveError(false);

    startSaving(async () => {
      try {
        const response = await fetch(`/api/testimonials/${testimonial.id}/edit`, {
          method: "POST",
          body: payload,
        });
        if (!response.ok) {
          setHasSaveError(true);
          return;
        }
        const data = await response.json().catch(() => null);
        const nextHeadline = (data?.ai_headline ?? trimmedHeadline).toString().trim();
        const nextBody = (data?.ai_body ?? trimmedBody).toString().trim();
        setCurrentHeadline(nextHeadline);
        setCurrentBody(nextBody);
        setHeadlineDraft(nextHeadline);
        setBodyDraft(nextBody);
        setIsEditing(false);
      } catch {
        setHasSaveError(true);
      }
    });
  };

  const inputClasses =
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-base font-semibold text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100";
  const textareaClasses =
    "min-h-[7rem] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100";
  const iconButtonBase =
    "inline-flex h-10 w-10 items-center justify-center rounded-full border text-slate-500 transition hover:text-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400";

  const metaInfo = (
    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
      <span>{name}</span>
      {createdAt ? <span className="text-slate-400">/ {createdAt}</span> : null}
      <StarDisplay rating={rating} />
    </div>
  );

  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4 px-6 py-5 sm:px-7">
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <span
              className={clsx(
                "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1",
                statusClasses
              )}
            >
              {statusLabel}
            </span>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={handleSave}
                    className={clsx(
                      iconButtonBase,
                      "border-sky-200 bg-sky-500 text-white hover:bg-sky-600"
                    )}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    ) : (
                      <CheckIcon className="h-4 w-4" />
                    )}
                    <span className="sr-only">保存</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEditing}
                    className={clsx(
                      iconButtonBase,
                      "border-slate-200 bg-white hover:bg-slate-100"
                    )}
                    disabled={isSaving}
                  >
                    <XIcon className="h-4 w-4" />
                    <span className="sr-only">キャンセル</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleStartEditing}
                  className={clsx(
                    iconButtonBase,
                    "border-slate-200 bg-white hover:bg-slate-100"
                  )}
                >
                  <PencilIcon className="h-4 w-4" />
                  <span className="sr-only">編集</span>
                </button>
              )}
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <input
                value={headlineDraft}
                onChange={(event) => {
                  setHeadlineDraft(event.target.value);
                  setHasValidationError(false);
                  setHasSaveError(false);
                }}
                className={clsx(
                  inputClasses,
                  hasValidationError &&
                    !headlineDraft.trim() &&
                    "border-rose-300 focus:border-rose-300 focus:ring-rose-100"
                )}
                placeholder="タイトル"
                aria-label="タイトル"
                disabled={isSaving}
              />
              <textarea
                value={bodyDraft}
                onChange={(event) => {
                  setBodyDraft(event.target.value);
                  setHasValidationError(false);
                  setHasSaveError(false);
                }}
                className={clsx(
                  textareaClasses,
                  hasValidationError &&
                    !bodyDraft.trim() &&
                    "border-rose-300 focus:border-rose-300 focus:ring-rose-100"
                )}
                placeholder="本文"
                aria-label="本文"
                disabled={isSaving}
              />
              {hasValidationError ? (
                <p className="text-xs font-medium text-rose-500">
                  タイトルと本文を入力してください。
                </p>
              ) : null}
              {hasSaveError ? (
                <p className="text-xs font-medium text-rose-500">
                  保存に失敗しました。時間をおいて再度お試しください。
                </p>
              ) : null}
            </div>
          ) : (
            <>
              <h3 className="text-lg font-semibold leading-tight text-slate-900 sm:text-xl">
                {displayHeadline}
              </h3>
              {metaInfo}
            </>
          )}
        </div>

        <button
          type="button"
          onClick={handleToggleExpand}
          disabled={isEditing}
          className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-sky-50 hover:text-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
          aria-expanded={isExpanded}
        >
          {isExpanded ? <MinusIcon className="h-4 w-4" /> : <PlusIcon className="h-4 w-4" />}
          <span className="sr-only">{isExpanded ? "詳細を閉じる" : "詳細を開く"}</span>
        </button>
      </div>

      {isExpanded ? (
        <div className="space-y-5 border-t border-slate-100 bg-white px-6 pb-6 pt-5 sm:px-7">
          {!isEditing ? (
            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">{displayBody}</p>
          ) : null}
          <div className="flex flex-wrap gap-3">
            <form action={`/api/testimonials/${testimonial.id}/toggle`} method="post">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
              >
                {testimonial.is_public ? "公開停止" : "公開"}
              </button>
            </form>
            <form action={`/api/testimonials/${testimonial.id}/rerun`} method="post">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-600 transition hover:border-sky-200 hover:text-sky-600"
              >
                AI再生成
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </article>
  );
}

function RawTestimonialCard({ testimonial }: { testimonial: TestimonialRecord }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const name = testimonial.responses?.name?.trim() || "匿名";
  const rating = testimonial.responses?.rating;
  const createdAt = formatDisplayDate(testimonial.responses?.created_at);
  const comment = testimonial.responses?.content?.trim() || "未回答";

  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4 px-6 py-5 sm:px-7">
        <div>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span>{name}</span>
            {createdAt ? <span className="text-slate-400">/ {createdAt}</span> : null}
            <StarDisplay rating={rating} />
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-sky-50 hover:text-sky-600"
          aria-expanded={isExpanded}
        >
          {isExpanded ? <MinusIcon className="h-4 w-4" /> : <PlusIcon className="h-4 w-4" />}
          <span className="sr-only">{isExpanded ? "詳細を閉じる" : "詳細を開く"}</span>
        </button>
      </div>

      {isExpanded ? (
        <div className="border-t border-slate-100 bg-white px-6 pb-6 pt-5 sm:px-7">
          <dl className="space-y-4 text-sm text-slate-700">
            <div>
              <dt className="font-semibold text-slate-900">コメント</dt>
              <dd className="mt-1 whitespace-pre-wrap leading-7">{comment}</dd>
            </div>
          </dl>
        </div>
      ) : null}
    </article>
  );
}

export default function Dashboard({
  company,
  form,
  testimonials,
  members,
  membershipRole,
  selfMembership,
  currentUserId,
}: {
  company: any;
  form: any;
  testimonials: TestimonialRecord[] | null;
  members?: MemberRecord[] | null;
  membershipRole?: string | null;
  selfMembership?: { company_id?: string | null; created_at?: string | null; user_id?: string | null } | null;
  currentUserId?: string | null;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["id"]>(TABS[0].id);
  const [previewVersion, setPreviewVersion] = useState(() => Date.now());
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteState, inviteAction] = useFormState(inviteMember, inviteMemberInitialState);
  const inviteFormRef = useRef<HTMLFormElement>(null);
  const [billingError, setBillingError] = useState<string | null>(null);
  const [openSettings, setOpenSettings] = useState<{
    memberInvite: boolean;
    memberList: boolean;
    plan: boolean;
  }>({
    memberInvite: true,
    memberList: false,
    plan: false,
  });
  const [checkoutPending, startCheckoutTransition] = useTransition();
  const [portalPending, startPortalTransition] = useTransition();
  const [autoPublishEnabled, setAutoPublishEnabled] = useState(
    Boolean(company?.auto_publish_high_rating)
  );
  const [autoPublishError, setAutoPublishError] = useState<string | null>(null);
  const [autoPublishSettingPending, startAutoPublishSetting] = useTransition();
  const [showTrialModal, setShowTrialModal] = useState(false);

  function toggleSetting(key: "memberInvite" | "memberList" | "plan") {
    setOpenSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const handleAutoPublishToggle = (nextState: boolean) => {
    if (!company?.id) return;
    setAutoPublishError(null);

    startAutoPublishSetting(async () => {
      try {
        const response = await fetch("/api/companies/auto-publish-setting", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ companyId: company.id, enabled: nextState }),
        });

        const payload = await response.json().catch(() => null);

        if (!response.ok) {
          setAutoPublishError(
            payload && typeof payload.error === "string"
              ? payload.error
              : "自動公開設定の更新に失敗しました。"
          );
          return;
        }

        const enabled =
          typeof payload?.enabled === "boolean" ? payload.enabled : nextState;

        setAutoPublishEnabled(enabled);
        setAutoPublishError(null);
        router.refresh();
      } catch {
        setAutoPublishError("自動公開設定の更新に失敗しました。");
      }
    });
  };

  useEffect(() => {
    const next = Boolean(company?.auto_publish_high_rating);
    setAutoPublishEnabled((prev) => (prev === next ? prev : next));
  }, [company?.auto_publish_high_rating]);

  if (!company) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-3xl border border-slate-200 bg-white/90 px-8 py-6 text-sm text-slate-600 shadow-lg">
          読み込み中...
        </div>
      </main>
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const formUrl = form?.slug ? `${appUrl}/form/${form.slug}` : undefined;
  const embedUrl =
    company?.slug && company?.iframe_token
      ? `${appUrl}/embed/${company.slug}?token=${company.iframe_token}`
      : undefined;
  const embedCode = embedUrl
    ? `<iframe src="${embedUrl}" style="width:100%;height:500px;border:0;" title="お客様の声"></iframe>`
    : "";

  const safeTestimonials = testimonials ?? [];
  const safeMembers = members ?? [];
  const normalizedRole = membershipRole ?? "member";
  const isAdmin = normalizedRole === "admin";
  const aiLimit = 500;
  const aiUsage = safeTestimonials.length;
  const isAiLimitReached = aiUsage >= aiLimit;
  const subscriptionStatus = (company?.subscription_status as string | undefined) ?? undefined;
  const trialEndsAt = company?.trial_ends_at ? new Date(company.trial_ends_at) : null;
  const trialEndsAtLabel = company?.trial_ends_at ? formatDisplayDate(company.trial_ends_at) : undefined;
  const isTrialingSubscription =
    subscriptionStatus === "trialing" && trialEndsAt ? trialEndsAt.getTime() > Date.now() : false;
  const isActiveSubscription = subscriptionStatus === "active";
  const hasSubscription = isActiveSubscription || isTrialingSubscription;
  const subscriptionStatusLabel = hasSubscription
    ? isActiveSubscription
      ? "契約中"
      : trialEndsAtLabel
        ? `トライアル中（〜${trialEndsAtLabel}）`
        : "トライアル中"
    : "未契約";
  const canManageBilling = isAdmin;

  const sortedMembers = useMemo(() => {
    return [...safeMembers].sort((a, b) => {
      const roleA = a.role ?? "";
      const roleB = b.role ?? "";
      if (roleA === roleB) {
        return (a.email ?? "").localeCompare(b.email ?? "", "ja");
      }
      if (roleA === "admin") return -1;
      if (roleB === "admin") return 1;
      return roleA.localeCompare(roleB, "ja");
    });
  }, [safeMembers]);

  const companyCreatedAt = company?.created_at ? new Date(company.created_at) : null;
  const membershipCreatedAt = selfMembership?.created_at ? new Date(selfMembership.created_at) : null;
  const isCompanyCreator =
    Boolean(
      isAdmin &&
        companyCreatedAt &&
        membershipCreatedAt &&
        Math.abs(membershipCreatedAt.getTime() - companyCreatedAt.getTime()) < 5 * 60 * 1000
    ) || false;
  const isFreshCompany =
    companyCreatedAt ? Date.now() - companyCreatedAt.getTime() < 7 * 24 * 60 * 60 * 1000 : false;
  const shouldShowTrialBanner = isCompanyCreator && !hasSubscription && isFreshCompany;
  const trialStorageKey = company?.id ? `trial-modal-${company.id}` : null;

  const handleSubscribe = () => {
    setBillingError(null);
    startCheckoutTransition(async () => {
      const result = await createStandardCheckoutSession();
      if (result.status === "success") {
        window.location.href = result.url;
        return;
      }
      setBillingError(result.message);
    });
  };

  const handleManageBilling = () => {
    setBillingError(null);
    startPortalTransition(async () => {
      const result = await createBillingPortalSession();
      if (result.status === "success") {
        window.location.href = result.url;
        return;
      }
      setBillingError(result.message);
    });
  };

  const dismissTrialModal = () => {
    if (trialStorageKey && typeof window !== "undefined") {
      window.localStorage.setItem(trialStorageKey, "1");
    }
    setShowTrialModal(false);
  };

  const viewPlanFromModal = () => {
    dismissTrialModal();
    setOpenSettings((prev) => ({ ...prev, plan: true }));
  };

  useEffect(() => {
    if (inviteState.status === "success") {
      setInviteEmail("");
      inviteFormRef.current?.reset();
    }
  }, [inviteState]);

  useEffect(() => {
    setBillingError(null);
  }, [hasSubscription]);

  useEffect(() => {
    if (!shouldShowTrialBanner || !trialStorageKey) return;
    if (typeof window === "undefined") return;
    const alreadyShown = window.localStorage.getItem(trialStorageKey);
    if (alreadyShown === "1") return;
    setShowTrialModal(true);
  }, [shouldShowTrialBanner, trialStorageKey]);

  function renderContent() {
    if (activeTab === "ai") {
      const autoPublishErrorClass = "text-xs font-medium text-rose-500 sm:text-sm";

      return (
        <div className="p-6 sm:p-8">
          <p className="mb-6 text-sm text-slate-500">
            AI整形後のデータです。ここで公開非公開を制御します。
          </p>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                role="switch"
                aria-checked={autoPublishEnabled}
                onClick={() => handleAutoPublishToggle(!autoPublishEnabled)}
                disabled={autoPublishSettingPending || !company?.id}
                className={clsx(
                  "relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500",
                  autoPublishEnabled ? "bg-sky-500" : "bg-slate-300",
                  (autoPublishSettingPending || !company?.id) && "cursor-not-allowed opacity-60"
                )}
              >
                <span
                  className={clsx(
                    "inline-block h-5 w-5 transform rounded-full bg-white shadow transition",
                    autoPublishEnabled ? "translate-x-5" : "translate-x-1"
                  )}
                  aria-hidden="true"
                />
              </button>
              <span className="text-xs font-medium text-slate-500 sm:text-sm">
                ☆4以上の評価を自動公開
              </span>
            </div>
            {autoPublishError ? (
              <span className={autoPublishErrorClass}>{autoPublishError}</span>
            ) : null}
          </div>
          {isAiLimitReached ? (
            <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              AI整形の上限（500件）に達しました。公開設定の見直しやプラン変更をご検討ください。
            </div>
          ) : null}
          {!safeTestimonials.length ? (
            <EmptyState
              title="まだ整形済みのデータがありません"
              description="アンケートに回答が集まると、AI整形されたお客様の声がここに並びます。"
            />
          ) : (
            <div className="space-y-4">
              {safeTestimonials.map((testimonial) => (
                <AiTestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          )}
        </div>
      );
    }

    if (activeTab === "raw") {
      return (
        <div className="p-6 sm:p-8">
          <p className="mb-6 text-sm text-slate-500">アンケート結果の原文です。</p>
          {!safeTestimonials.length ? (
            <EmptyState
              title="まだアンケート回答がありません"
              description="アンケートに回答が集まると、原文データがここに並びます。"
            />
          ) : (
            <div className="space-y-4">
              {safeTestimonials.map((testimonial) => (
                <RawTestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          )}
        </div>
      );
    }

    if (activeTab === "share") {
      if (!embedUrl) {
        return (
          <div className="p-6 sm:p-8">
            <EmptyState
              title="埋め込み設定がまだありません"
              description="会社のスラッグまたはトークンが見つかりませんでした。設定を確認してください。"
            />
          </div>
        );
      }

      return (
        <div className="space-y-6 p-6 sm:p-8">
          <div>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">
              公開中の「お客様の声」を自社サイトに埋め込み表示できます。
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              下のコードをサイトのHTML（表示したい場所）にそのまま貼り付けてください。
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800/40 bg-slate-900/95 p-5 text-sky-100 shadow-inner">
            <code className="block whitespace-pre-wrap break-all text-xs leading-relaxed">
              {embedCode}
            </code>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">プレビュー</p>
              <button
                type="button"
                onClick={() => setPreviewVersion(Date.now())}
                className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-600"
              >
                更新
              </button>
            </div>
            <IframePreview src={embedUrl} version={previewVersion} />
          </div>
        </div>
      );
    }

    if (activeTab === "settings") {
      const inviteDisabled = !isAdmin;
      const hasStripeCustomer = Boolean(company?.stripe_customer_id);
      const canOpenPortal = canManageBilling && hasStripeCustomer;

      return (
        <div className="space-y-4 p-6 sm:p-8">
          <SettingsSection
            title="メンバー招待"
            description="チームで管理する場合はここから追加します。"
            open={openSettings.memberInvite}
            onToggle={() => toggleSetting("memberInvite")}
          >
            <div className="space-y-5">
              {inviteState.status === "success" ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {inviteState.message}
                </div>
              ) : null}
              {inviteState.status === "error" ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {inviteState.message}
                </div>
              ) : null}
              <form
                ref={inviteFormRef}
                action={inviteAction}
                className={clsx("space-y-4", inviteDisabled && "pointer-events-none opacity-60")}
              >
                <input type="hidden" name="companyId" value={company.id} />
                <div>
                  <label htmlFor="invite-email" className="text-sm font-semibold text-slate-700">
                    メールアドレス
                  </label>
                  <input
                    id="invite-email"
                    name="email"
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(event) => setInviteEmail(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                    placeholder="team@example.com"
                    disabled={inviteDisabled}
                  />
                </div>
                <div>
                  <label htmlFor="invite-role" className="text-sm font-semibold text-slate-700">
                    権限
                  </label>
                  <select
                    id="invite-role"
                    name="role"
                    defaultValue="editor"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                    disabled={inviteDisabled}
                  >
                    <option value="editor">編集権限</option>
                    <option value="member">閲覧のみ</option>
                    <option value="admin">管理者</option>
                  </select>
                </div>
                {inviteDisabled ? (
                  <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-700">
                    メンバー招待は管理者のみ操作できます。
                  </p>
                ) : null}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={inviteDisabled}
                    className={clsx(
                      "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                      inviteDisabled
                        ? "cursor-not-allowed bg-slate-200 text-slate-500"
                        : "bg-sky-500 text-white hover:bg-sky-600 focus-visible:outline-sky-500"
                    )}
                  >
                    招待メールを送信
                  </button>
                </div>
              </form>
            </div>
          </SettingsSection>

          <SettingsSection
            title="メンバー一覧"
            description="現在参加しているメンバーの状況です。"
            open={openSettings.memberList}
            onToggle={() => toggleSetting("memberList")}
          >
            <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white/80 shadow-sm">
              {sortedMembers.length ? (
                <ul className="divide-y divide-slate-100">
                  {sortedMembers.map((member) => {
                    const roleLabel =
                      ROLE_LABELS[member.role ?? "member"] ?? member.role ?? "member";
                    const statusLabel = STATUS_LABELS[member.status];
                    const statusClass =
                      member.status === "pending"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-emerald-50 text-emerald-700";
                    const joinedLabel = member.joinedAt ? formatDisplayDate(member.joinedAt) : undefined;
                    const isSelf = currentUserId ? member.id === currentUserId : false;

                    return (
                      <li
                        key={member.id}
                        className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-slate-900">
                              {member.email ?? "メール未設定"}
                            </p>
                            {isSelf ? (
                              <span className="inline-flex items-center rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-semibold text-sky-600">
                                あなた
                              </span>
                            ) : null}
                          </div>
                          <p className="text-xs text-slate-500">
                            {joinedLabel ? `${statusLabel} · ${joinedLabel}` : statusLabel}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            {roleLabel}
                          </span>
                          <span
                            className={clsx(
                              "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                              statusClass
                            )}
                          >
                            {statusLabel}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="px-5 py-8 text-center text-sm text-slate-500">
                  メンバーがまだ登録されていません。
                </div>
              )}
            </div>
          </SettingsSection>

          <SettingsSection
            title="プラン設定"
            description="現在のプランを確認し、必要に応じて変更します。"
            open={openSettings.plan}
            onToggle={() => toggleSetting("plan")}
          >
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                <p className="text-sm font-semibold text-slate-900">Standard プラン（¥2,980 / 月）</p>
                <p className="mt-1 text-xs text-slate-500">AI整形500件まで・チーム管理対応</p>
                <p className="mt-3 text-xs text-slate-500">現在の状態: {subscriptionStatusLabel}</p>
                {trialEndsAtLabel ? (
                  <p className="text-xs text-slate-400">無料期間の終了予定日: {trialEndsAtLabel}</p>
                ) : null}
              </div>
              {billingError ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">
                  {billingError}
                </div>
              ) : null}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleSubscribe}
                  disabled={!canManageBilling || checkoutPending}
                  className={clsx(
                    "inline-flex items-center justify-center rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600",
                    (checkoutPending || !canManageBilling) && "opacity-60",
                    !canManageBilling && "cursor-not-allowed"
                  )}
                >
                  {checkoutPending ? "準備中..." : "Standardプランを契約する"}
                </button>
                <button
                  type="button"
                  onClick={handleManageBilling}
                  disabled={!hasStripeCustomer || !canManageBilling || portalPending}
                  className={clsx(
                    "inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100",
                    (!hasStripeCustomer || !canManageBilling || portalPending) && "opacity-60",
                    (!hasStripeCustomer || !canManageBilling) && "cursor-not-allowed"
                  )}
                >
                  {portalPending ? "ポータルを開いています..." : "請求情報を管理"}
                </button>
              </div>
              <p className="text-[11px] leading-5 text-slate-500">
                管理者のみがプランを変更できます。トライアル期間中に契約すると自動的に継続利用へ切り替わります。
              </p>
            </div>
          </SettingsSection>
        </div>
      );
    }

    return null;
  }

  return (
    <>
      <main className="relative min-h-screen bg-slate-50 pb-16 pt-10">
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,#bae6fd55,transparent_55%),radial-gradient(circle_at_bottom_right,#bbf7d055,transparent_60%)]"
          aria-hidden="true"
        />
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
          <header className="flex flex-col gap-6 rounded-3xl border border-slate-100 bg-white/80 p-8 shadow-lg shadow-sky-100 backdrop-blur sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-500">
                Testimonial Dashboard
              </p>
              <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{company?.name}</h1>
              {formUrl ? (
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span>アンケートURL:</span>
                  <Link
                    href={formUrl}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1.5 font-mono text-xs font-semibold text-white transition hover:bg-slate-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {formUrl}
                  </Link>
                  <CopyButton text={formUrl} label="コピー" copiedLabel="コピーしました" />
                </div>
              ) : null}
            </div>
            <div className="flex flex-col gap-3 sm:items-end">
              <Link
                href="/api/auth/signout"
                className="inline-flex items-center justify-center rounded-full border border-sky-200 bg-white px-5 py-2 text-sm font-semibold text-sky-600 transition hover:bg-sky-50"
              >
                サインアウト
              </Link>
            </div>
          </header>

          <div className="grid gap-6 lg:grid-cols:[240px_1fr] lg:grid-cols-[240px_1fr]">
            <nav className="rounded-3xl border border-slate-100 bg-white/80 p-3 shadow-sm shadow-sky-50 backdrop-blur">
              <ul className="space-y-1">
                {TABS.map((tab) => (
                  <li key={tab.id}>
                    <button
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={clsx(
                        "w-full rounded-2xl px-4 py-2.5 text-left text-sm font-semibold transition",
                        activeTab === tab.id
                          ? "bg-sky-500 text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                      )}
                    >
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <section className="overflow-hidden rounded-3xl border border-slate-100 bg-white/80 shadow-sm shadow-sky-50 backdrop-blur">
              {renderContent()}
            </section>
          </div>
        </div>
      </main>

      <TrialModal
        open={showTrialModal}
        onClose={dismissTrialModal}
        onViewPlan={viewPlanFromModal}
        trialEndsAtLabel={trialEndsAtLabel}
      />
    </>
  );
}

function TrialModal({
  open,
  onClose,
  onViewPlan,
  trialEndsAtLabel,
}: {
  open: boolean;
  onClose: () => void;
  onViewPlan: () => void;
  trialEndsAtLabel?: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-500">
              トライアル開始
            </p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">Standardプランを試用中です</h3>
            <p className="mt-2 text-sm text-slate-600">
              新しく作成した会社向けに、AI整形500件付きのStandardプランを7日間無料で有効化しました。
            </p>
            {trialEndsAtLabel ? (
              <p className="text-xs text-slate-500">無料期間の終了予定日: {trialEndsAtLabel}</p>
            ) : null}
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              閉じる
            </button>
            <button
              type="button"
              onClick={onViewPlan}
              className="inline-flex items-center justify-center rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
            >
              プラン設定を開く
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
