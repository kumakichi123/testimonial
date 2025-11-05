const records = [
  { label: '事業者名', value: 'Testimonial SaaS 運営事務局' },
  { label: '運営責任者', value: '運営チーム代表' },
  { label: '所在地', value: '東京都千代田区（詳細住所は正当なご請求に応じて開示します）' },
  { label: '連絡先', value: 'お問い合わせページのフォームよりご連絡ください。営業日以内に返信いたします。' },
  { label: '販売価格', value: '各プランページに税込価格を表示しています。' },
  { label: '商品代金以外の必要料金', value: '銀行振込手数料、通信回線費等は利用者の負担となります。' },
  { label: '支払方法・支払時期', value: 'クレジットカード決済：各カード会社の引き落とし日に準じます。銀行振込：請求書記載の期日までにお振込みください。' },
  { label: 'サービス開始時期', value: '決済完了後、即日利用可能です。銀行振込の場合は入金確認後に利用可能となります。' },
  { label: '返品・キャンセル', value: 'サービスの特性上、提供開始後の返金は受け付けておりません。契約中の解約は次回更新日以降に適用されます。' },
  { label: '動作環境', value: '最新の主要ブラウザおよびインターネット接続環境が必要です。詳細はサポートまでお問い合わせください。' },
]

const TokushohoPage = () => (
  <main className="mx-auto max-w-4xl px-4 py-16 space-y-10">
    <header className="space-y-4">
      <h1 className="text-3xl font-semibold text-gray-900">特定商取引法に基づく表記</h1>
      <p className="text-gray-600">
        Testimonial SaaSの提供に関して、特定商取引法第11条に基づき必要事項を以下のとおり表示します。
      </p>
    </header>
    <section className="space-y-6">
      <dl className="grid gap-4 md:grid-cols-2">
        {records.map((record) => (
          <div key={record.label} className="space-y-1">
            <dt className="text-sm font-semibold text-gray-500">{record.label}</dt>
            <dd className="text-gray-700 leading-relaxed">{record.value}</dd>
          </div>
        ))}
      </dl>
    </section>
    <footer className="text-sm text-gray-500">
      公表日：2025年11月1日
    </footer>
  </main>
)

export default TokushohoPage
