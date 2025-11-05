const sections = [
  {
    title: '1. Cookieとは',
    body: [
      'Cookieとは、利用者がウェブサイトを利用する際にブラウザとサーバー間でやり取りされる情報の一部であり、利用者の端末に保存されます。',
      '本サービスでは、必要最小限のCookieのみを使用し、利用者の利便性向上と利用状況の把握を目的とします。',
    ],
  },
  {
    title: '2. 使用するCookieの種類',
    list: [
      '必須Cookie：ログイン状態の維持など、サービス提供に不可欠な機能のために使用します。',
      '分析Cookie：サービス品質向上のため、アクセス状況を匿名かつ統計的に把握します。',
    ],
  },
  {
    title: '3. 第三者によるCookie',
    body: [
      '本サービスは、アクセス解析ツールとして匿名化された統計情報のみを利用します。個人を特定できるデータは収集しません。',
      '第三者提供を行う場合には、利用目的や内容を事前に通知し、必要に応じて同意を取得します。',
    ],
  },
  {
    title: '4. Cookieの管理方法',
    body: [
      '利用者は、ブラウザ設定を変更することでCookieの受け取りを拒否または削除できます。',
      'Cookieを無効にすると一部機能が利用できない場合がありますが、主要な機能は引き続きご利用いただけます。',
    ],
  },
  {
    title: '5. 見直しについて',
    body: [
      'Cookieの利用目的や内容に変更が生じた場合には、本ページで最新の情報を公開します。重要な変更がある場合は、適宜通知を行います。',
    ],
  },
]

const CookiePolicyPage = () => (
  <main className="mx-auto max-w-4xl px-4 py-16 space-y-12">
    <header className="space-y-4">
      <h1 className="text-3xl font-semibold text-gray-900">クッキーポリシー</h1>
      <p className="text-gray-600">
       テスティモにおけるCookieおよび類似技術の利用方針について説明します。
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
      公開日：2025年11月1日
    </footer>
  </main>
)

export default CookiePolicyPage
