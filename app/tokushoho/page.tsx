import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記 | ノーテリア",
  description: "SaaS「ノーテリア」に関する特定商取引法に基づく表記を掲載しています。",
}

const records = [
  { label: "事業者名", value: "ノーテリア" },
  { label: "運営責任者", value: "朝部 耀平" },
  { label: "所在地", value: "北海道札幌市北区北18条西6-1-7-201" },
  { label: "電話番号", value: "070-3619-7051" },
  {
    label: "お問い合わせ",
    value: "お問い合わせページのフォームよりご連絡ください。原則24時間以内に返信いたします。",
  },
  { label: "販売価格", value: "各サービスの紹介ページに税込価格を表示しています。" },
  {
    label: "商品代金以外の必要料金",
    value: "インターネット接続に伴う通信料や振込手数料はご遺族様のご負担となります。",
  },
  {
    label: "支払方法・支払時期",
    value: "クレジットカード決済：各カード会社の規約に基づきご請求させていただきます。その他の決済方法をご希望の場合はお問い合わせください。",
  },
  { label: "サービス開始時期", value: "決済完了後すぐにご利用いただけます。" },
  {
    label: "返品・キャンセル",
    value: "デジタルサービスの性質上、提供開始後の返金には原則対応いたしかねます。解約は次回更新日以降に適用されます。",
  },
]

const TokushohoPage = () => (
  <main className="mx-auto max-w-4xl px-4 py-16 space-y-10">
    <header className="space-y-4">
      <h1 className="text-3xl font-semibold text-gray-900">特定商取引法に基づく表記</h1>
      <p className="text-gray-600">
        SaaS「ノーテリア」の提供に関し、特定商取引法第11条に基づく表記を以下の通り掲載します。
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
      公表日：2025年11月6日
    </footer>
  </main>
)

export default TokushohoPage
