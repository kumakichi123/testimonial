'use client'

import Link from 'next/link'
import { FormEvent } from 'react'

const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault()
  const form = event.currentTarget
  const data = new FormData(form)
  const name = data.get('name')
  const email = data.get('email')
  const message = data.get('message')
  const mailto = new URL(`mailto:support@testimonial-saas.jp`)

  const body = [
    name ? `お名前: ${name}` : null,
    `メールアドレス: ${email}`,
    '',
    'お問い合わせ内容:',
    message,
  ]
    .filter(Boolean)
    .join('\n')

  mailto.searchParams.set('subject', 'Testimonial SaaSへのお問い合わせ')
  mailto.searchParams.set('body', body)

  window.location.href = mailto.toString()
}

const ContactPage = () => (
  <main className="mx-auto max-w-3xl px-4 py-16 space-y-12">
    <header className="space-y-4">
      <h1 className="text-3xl font-semibold text-gray-900">お問い合わせ</h1>
      <p className="text-gray-600 leading-relaxed">
        ご不明点やご相談は、以下のフォームからご連絡ください。必要事項のみをご入力のうえ送信いただければ、担当者より2営業日以内に返信いたします。
      </p>
      <p className="text-sm text-gray-500">
        なお、個人情報の提供は必要最小限にとどめてください。利用目的の詳細は<Link href="/privacy" className="text-blue-600 hover:underline ml-1">プライバシーポリシー</Link>をご参照ください。
      </p>
    </header>
    <section>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            お名前（任意）
          </label>
          <input
            id="name"
            name="name"
            type="text"
            maxLength={50}
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
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <p className="text-xs text-gray-500">
          送信時にデバイスのメーラーが起動し、上記内容が自動挿入されます。送信前に内容をご確認ください。
        </p>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          送信する
        </button>
      </form>
    </section>
    <section className="space-y-2 text-sm text-gray-600">
      <h2 className="text-base font-semibold text-gray-800">その他の連絡手段</h2>
      <p>
        緊急のご用件は、件名に「至急」と明記のうえ上記メールアドレスまでお送りください。電話番号等の追加情報が必要な場合は、正当なご請求に応じて個別にお知らせいたします。
      </p>
    </section>
  </main>
)

export default ContactPage
