'use client'

import type { ReactNode } from 'react'

import StarRating from './star-rating'

const REQUIRED_MARK = (
  <span className="ml-1 align-middle text-sm font-semibold text-rose-500">*</span>
)
const OPTIONAL_MARK = (
  <span className="ml-2 align-middle text-xs font-normal text-slate-400">
    任意
  </span>
)

const fieldClassName = 'flex flex-col gap-2'
const labelClassName = 'text-sm font-medium text-slate-700 sm:text-base'
const inputClassName =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-0'

const FormField = ({
  label,
  children,
}: {
  label: ReactNode
  children: ReactNode
}) => (
  <div className={fieldClassName}>
    <label className={labelClassName}>{label}</label>
    {children}
  </div>
)

export default function Form({ slug }: { slug: string }) {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="card w-full space-y-10 p-6 sm:p-10">
        <header className="space-y-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-500">
            Voice Survey
          </p>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            お客様の声アンケート
          </h1>
          <p className="text-sm text-slate-500 sm:text-base">
            すべての項目にご回答いただくことで、より良いサービスづくりに活かさせていただきます。
          </p>
        </header>

        <form
          action={`/api/submit/${slug}`}
          method="post"
          className="space-y-6"
        >
          <FormField label={<span>お名前{REQUIRED_MARK}</span>}>
            <input name="name" required className={inputClassName} />
          </FormField>

          <FormField label={<span>今回の内容{REQUIRED_MARK}</span>}>
            <textarea
              name="content"
              required
              className={`${inputClassName} min-h-[7.5rem] resize-y`}
            />
          </FormField>
          
          <FormField label={<span>ご利用前の課題{REQUIRED_MARK}</span>}>
            <textarea
              name="problem"
              required
              className={`${inputClassName} min-h-[7.5rem] resize-y`}
            />
          </FormField>

          <FormField label={<span>ご利用後の変化{REQUIRED_MARK}</span>}>
            <textarea
              name="result"
              required
              className={`${inputClassName} min-h-[7.5rem] resize-y`}
            />
          </FormField>



          <FormField
            label={
              <span>
                どこで知りましたか？{OPTIONAL_MARK}
              </span>
            }
          >
            <input name="heard_from" className={inputClassName} />
          </FormField>

          <FormField label={<span>総合評価{REQUIRED_MARK}</span>}>
            <StarRating name="rating" />
          </FormField>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 sm:px-6">
            <label className="flex items-start gap-3 text-left text-sm sm:text-base">
              <input
                type="checkbox"
                required
                className="mt-1 h-5 w-5 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-slate-700">
                <span className="font-semibold">
                  公開される可能性への同意{REQUIRED_MARK}
                </span>
                <br />
                サービス改善や事例紹介として内容が公開される可能性があることに同意します。
              </span>
            </label>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500 sm:text-sm">
              ご入力内容はプライバシーポリシーに基づき適切に管理します。
            </p>
            <button
              className="btn primary w-full justify-center text-base sm:w-auto"
              type="submit"
            >
              送信する
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
