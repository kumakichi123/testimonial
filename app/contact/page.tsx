'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'

const normalize = (value: FormDataEntryValue | null) =>
  (typeof value === 'string' ? value.trim() : '')

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

const ContactPage = () => {
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const form = event.currentTarget
    const data = new FormData(form)

    const payload = {
      name: normalize(data.get('name')),
      email: normalize(data.get('email')),
      message: normalize(data.get('message')),
    }

    if (!payload.name || !payload.email || !payload.message) {
      setStatus('error')
      setErrorMessage('必須項目を入力してください。')
      return
    }

    setStatus('submitting')
    setErrorMessage(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = (await response.json().catch(() => ({}))) as {
        error?: string
      }

      if (!response.ok) {
        throw new Error(result.error ?? '送信に失敗しました。時間をおいて再度お試しください。')
      }

      form.reset()
      setStatus('success')
    } catch (error) {
      setStatus('error')
      setErrorMessage(
        error instanceof Error
          ? error.message
          : '送信に失敗しました。時間をおいて再度お試しください。'
      )
    }
  }

  const isSubmitting = status === 'submitting'

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 space-y-12">
      <header className="space-y-4">
        <h1 className="text-3xl font-semibold text-gray-900">お問い合わせ</h1>
        <p className="text-gray-600 leading-relaxed">
          テスティモに関するご質問や導入のご相談、資料請求などは以下のフォームよりお気軽にお問い合わせください。担当者が内容を確認のうえ、順次ご連絡いたします。
        </p>
        <p className="text-sm text-gray-500">
          お預かりする個人情報の取扱いについては
          <Link href="/privacy" className="text-blue-600 hover:underline mx-1">
            プライバシーポリシー
          </Link>
          をご確認ください。
        </p>
      </header>
      <section>
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              お名前
            </label>
            <input
              id="name"
              name="name"
              type="text"
              maxLength={50}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoComplete="name"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              メールアドレス（必須）
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              お問い合わせ内容（必須）
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              maxLength={2000}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <p className="text-xs text-gray-500">
            ご入力いただいた内容は、送信ボタンを押すと弊社に送信され、担当者が確認します。
          </p>
          {status === 'success' && (
            <p className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700" role="status">
              送信が完了しました。担当者より折り返しご連絡いたします。
            </p>
          )}
          {status === 'error' && errorMessage && (
            <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {errorMessage}
            </p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? '送信中...' : '送信する'}
          </button>
        </form>
      </section>

    </main>
  )
}

export default ContactPage
