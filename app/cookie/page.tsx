const sections = [
  {
    title: '1. Cookieとは',
    body: [
      'Cookieとは、ウェブサイトの利用状況を記録するためにブラウザに保存される小さなテキストファイルです。',
      '当社はCookieを活用し、利用者に最適な体験を提供するとともに、本サービスの改善に役立てています。',
    ],
  },
  {
    title: '2. 利用するCookieの種類',
    list: [
      '必須Cookie：ログイン維持やセッション管理など、サービス提供に不可欠なもの',
      '分析Cookie：利用状況を把握するためのアクセス解析ツールが設定するもの',
    ],
  },
  {
    title: '3. 利用目的',
    body: [
      '本サービスの機能提供および安定した運用を実現するため。',
      '利用状況を分析し、コンテンツや機能の改善、新サービスの開発に役立てるため。',
    ],
  },
  {
    title: '4. Cookieの管理方法',
    body: [
      '利用者は、ブラウザの設定を変更することでCookieの受け入れ可否や削除を選択できます。',
      'Cookieを無効化した場合、一部の機能が利用できなくなることがありますのでご注意ください。',
    ],
  },
  {
    title: '5. 同意の撤回',
    body: [
      'Cookieの利用に同意いただいた後でも、ブラウザ設定を変更することでいつでも同意を撤回できます。',
      '同意を撤回した場合でも、当社は法令および本ポリシーに基づき適切にデータを管理します。',
    ],
  },
]

const CookiePolicyPage = () => (
  <main className="mx-auto max-w-4xl px-4 py-16 space-y-12">
    <header className="space-y-4">
      <h1 className="text-3xl font-semibold text-gray-900">クッキーポリシー</h1>
      <p className="text-gray-600">
        SaaS「ノーテリア」ではCookieを活用し、より良いサービス体験を提供しています。本ポリシーではその取扱いについてご説明します。
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
      施行日：2025年11月6日
    </footer>
  </main>
)

export default CookiePolicyPage
