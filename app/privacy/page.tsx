const sections = [
  {
    title: '1. 基本方針',
    body: [
      'Testimonial SaaS（以下「本サービス」）は、利用者の個人情報を日本の個人情報保護法その他関連法令およびガイドラインに基づき適切に取り扱います。',
      '個人情報を取り扱う全ての者に対して必要な教育を行い、継続的な改善に努めます。',
    ],
  },
  {
    title: '2. 取得する情報と利用目的',
    list: [
      'アカウント情報（氏名、メールアドレスなど）：サービス提供およびログイン管理のため',
      '利用ログ、アクセス履歴：機能改善、セキュリティ維持、障害対応のため',
      'サポートへのお問い合わせ内容：回答および問題解決のため',
    ],
    body: [
      '機微な個人情報や不要な情報は取得せず、必要最小限の範囲に限定します。',
    ],
  },
  {
    title: '3. 情報の第三者提供',
    body: [
      '法令に基づく場合または本人の同意がある場合を除き、個人情報を第三者に提供することはありません。',
      '共同利用を行う場合には、その目的、範囲、管理責任者を事前に明示します。',
    ],
  },
  {
    title: '4. 安全管理措置',
    body: [
      '通信の暗号化やアクセス権限の最小化など、適切な技術的・組織的安全管理措置を講じます。',
      '個人情報を取り扱う機器やシステムへのアクセス記録を定期的に点検します。',
    ],
  },
  {
    title: '5. 個人情報の開示・訂正・利用停止',
    body: [
      '本人からの求めに応じて、遅滞なく個人情報の開示・訂正・利用停止等を行います。',
      '手続の詳細はお問い合わせフォームよりご連絡ください。本人確認のため、必要最小限の情報提供をお願いする場合があります。',
    ],
  },
  {
    title: '6. Cookie等の利用',
    body: [
      '本サービスは、利便性向上および利用状況の把握のためCookieや類似技術を利用します。',
      'ブラウザでCookieを無効化することができますが、一部の機能が使用できなくなる場合があります。',
    ],
  },
  {
    title: '7. 改定',
    body: [
      '本方針の内容を予告なく変更することがあります。重要な変更がある場合は、本サービス上で周知します。',
      '改定後に本サービスを利用した場合、改定された方針に同意したものとみなします。',
    ],
  },
  {
    title: '8. お問い合わせ',
    body: [
      '個人情報の取り扱いに関するご相談は、お問い合わせページのフォームからご連絡ください。必要に応じて迅速に対応いたします。',
    ],
  },
]

const PrivacyPage = () => (
  <main className="mx-auto max-w-4xl px-4 py-16 space-y-12">
    <header className="space-y-4">
      <h1 className="text-3xl font-semibold text-gray-900">プライバシーポリシー</h1>
      <p className="text-gray-600">
        本プライバシーポリシーは、本サービスが取得する個人情報の種類、利用目的、管理体制について定めるものです。
      </p>
    </header>
    <section className="space-y-10">
      {sections.map((section) => (
        <article key={section.title} className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">{section.title}</h2>
          <div className="space-y-3 text-gray-700 leading-relaxed">
            {section.body?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.list && (
              <ul className="list-disc pl-6 space-y-2">
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        </article>
      ))}
    </section>
    <footer className="text-sm text-gray-500">
      制定日：2025年11月1日
    </footer>
  </main>
)

export default PrivacyPage
