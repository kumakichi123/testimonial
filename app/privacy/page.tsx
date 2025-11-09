const sections = [
  {
    title: '第1条（基本方針）',
    body: [
      'テスティモ株式会社（以下「当社」といいます）は、個人情報保護の重要性を認識し、関連法令およびガイドラインを遵守して個人情報を適切に取り扱います。',
      '当社は、本ポリシーに従い個人情報の取得、利用、管理を行い、継続的な改善に努めます。',
    ],
  },
  {
    title: '第2条（取得する情報と方法）',
    body: [
      '当社は、利用者が本サービスを利用する際に、氏名、メールアドレス、所属組織、利用履歴、問い合わせ内容などの情報を取得します。',
      '情報の取得は、利用者による入力、Cookie等の技術による自動取得、アンケートやサポート対応などの過程で行います。',
    ],
  },
  {
    title: '第3条（利用目的）',
    list: [
      '本サービスの提供、維持、改善のため',
      'サポート対応および重要なお知らせの送信のため',
      '利用状況の分析や新機能の開発のため',
      '法令に基づく対応や不正利用の防止のため',
    ],
    body: [
      '当社は、取得した個人情報を上記目的の範囲内でのみ利用し、目的外利用を行いません。',
    ],
  },
  {
    title: '第4条（安全管理体制）',
    body: [
      '当社は、個人情報への不正アクセス、紛失、破壊、改ざん及び漏えいを防止するため、アクセス権限管理や暗号化など必要かつ適切な安全管理措置を講じます。',
      '万が一事故等が発生した場合には、速やかに原因究明と再発防止策を実施します。',
    ],
  },
  {
    title: '第5条（第三者提供・委託）',
    body: [
      '当社は、法令で定められた場合または利用者の同意がある場合を除き、個人情報を第三者に提供しません。',
      '業務委託先に個人情報の取扱いを委託する際は、委託先を適切に監督し、必要な契約を締結します。',
    ],
  },
  {
    title: '第6条（Cookieの利用）',
    body: [
      '当社は、本サービスの利便性向上や利用状況の把握のためにCookieおよび同種の技術を利用します。',
      '利用者は、ブラウザの設定を変更することでCookieの受け入れを拒否できますが、その場合本サービスの一部機能が制限されることがあります。',
    ],
  },
  {
    title: '第7条（開示等の請求）',
    body: [
      '利用者は、当社が保有する自己の個人情報について、開示、訂正、利用停止、削除等を求めることができます。',
      '請求手続きの詳細は、下記お問い合わせ窓口までご連絡ください。法令に基づき手数料をいただく場合があります。',
    ],
  },
  {
    title: '第8条（お問い合わせ窓口）',
    body: [
      '本ポリシーに関するお問い合わせは、お問い合わせページのフォームまでご連絡ください。',
    ],
  },
]

const PrivacyPage = () => (
  <main className="mx-auto max-w-4xl px-4 py-16 space-y-12">
    <header className="space-y-4">
      <h1 className="text-3xl font-semibold text-gray-900">プライバシーポリシー</h1>
      <p className="text-gray-600">
        テスティモは、個人情報の適切な管理を最優先に考えています。以下のポリシーをご確認のうえ、本サービスをご利用ください。
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
      制定日：2025年11月6日
    </footer>
  </main>
)

export default PrivacyPage
