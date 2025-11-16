import React from 'react';
import { Phone, Zap, CheckCircle, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            害虫駆除の「取りこぼし受付」<br />1日何件の依頼を逃していますか？
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            現場に出ている間の着信。深夜、週末、祝日開け。<br />
            「留守電に残ってた依頼に折り返すと別の業者だった」<br />
            「駆除中なのに着信が積み重なって、対応しきれない」
          </p>
          <div className="bg-white text-blue-600 inline-block px-8 py-4 rounded-lg shadow-lg">
            <p className="text-3xl font-bold">初期費用0円・月額9,800円（税込）</p>
            <p className="text-lg mt-2">転送設定まで含めて、最短10分で今日から使える</p>
            <p className="text-sm mt-3 text-yellow-200">1日分の人件費で24時間受付</p>
            <p className="text-sm mt-1 text-gray-600">
              月額制サブスク ＋ 通話料25円/分（実費）
            </p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">こんなお悩み、ありませんか？</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-red-500 text-4xl mb-4">📞</div>
              <h3 className="font-bold text-lg mb-2">現場で電話に出られない</h3>
              <p className="text-gray-600">作業中の電話、ほぼ取りこぼし</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-red-500 text-4xl mb-4">🌙</div>
              <h3 className="font-bold text-lg mb-2">夜間・土日の問い合わせ</h3>
              <p className="text-gray-600">折り返しが遅れて他社に流れる</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-red-500 text-4xl mb-4">📢</div>
              <h3 className="font-bold text-lg mb-2">営業電話が多すぎる</h3>
              <p className="text-gray-600">本当に大事な電話が埋もれる</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">AIが24時間、一次受付を代行</h2>
          <p className="text-center text-gray-600 mb-12">
            害虫駆除業者向け「AI電話受付」、10分で導入できます
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-bold text-xl mb-4 flex items-center">
                <Phone className="mr-2 text-blue-600" />
                AIがやること
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="mr-2 text-green-500 flex-shrink-0 mt-1" size={20} />
                  <span>「〇〇害虫駆除でございます」と名乗って一次受付</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 text-green-500 flex-shrink-0 mt-1" size={20} />
                  <span>お名前・住所・電話番号・希望日時を聞き取り</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 text-green-500 flex-shrink-0 mt-1" size={20} />
                  <span>「見積り無料」「対応エリア」など、よくある質問に自動で回答</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 text-green-500 flex-shrink-0 mt-1" size={20} />
                  <span>すべての通話を自動録音し、あとから聞き返せるように保存</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 text-green-500 flex-shrink-0 mt-1" size={20} />
                  <span>
                    受付内容をメール・LINEと、管理画面（ダッシュボード）で一覧表示
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-bold text-xl mb-4 flex items-center">
                <Zap className="mr-2 text-green-600" />
                あなたがやること
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <ArrowRight className="mr-2 text-blue-500 flex-shrink-0 mt-1" size={20} />
                  <span>翌朝、メール・LINEまたは管理画面で内容をチェック</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="mr-2 text-blue-500 flex-shrink-0 mt-1" size={20} />
                  <span>本当に必要な問い合わせだけに絞って折り返し</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="mr-2 text-blue-500 flex-shrink-0 mt-1" size={20} />
                  <span>営業電話は自動で切り分け・フィルタリング済み</span>
                </li>
              </ul>
              <div className="mt-6 p-4 bg-white rounded border-2 border-green-500">
                <p className="font-bold text-green-700">取りこぼし電話が、そのまま売上に変わります。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table + 安さの理由 */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">他社サービスとの違い</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-lg">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-4 px-6 text-left">項目</th>
                  <th className="py-4 px-6 text-center">他社サービス</th>
                  <th className="py-4 px-6 text-center bg-blue-700">当サービス</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-4 px-6 font-semibold">初期費用</td>
                  <td className="py-4 px-6 text-center">10万円</td>
                  <td className="py-4 px-6 text-center bg-blue-50">
                    <span className="text-2xl font-bold text-blue-600">0円</span>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 font-semibold">月額料金</td>
                  <td className="py-4 px-6 text-center">5万円〜</td>
                  <td className="py-4 px-6 text-center bg-blue-50">
                    <span className="text-2xl font-bold text-blue-600">9,800円</span>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 font-semibold">導入期間</td>
                  <td className="py-4 px-6 text-center">2〜4週間</td>
                  <td className="py-4 px-6 text-center bg-blue-50">
                    <span className="text-2xl font-bold text-blue-600">約10分</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold">課金方式</td>
                  <td className="py-4 px-6 text-center">通話ごと課金＋オプション</td>
                  <td className="py-4 px-6 text-center bg-blue-50">
                    <span className="font-bold text-blue-600">
                      月額制サブスク（通話料は実費のみ別途）
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 安さの理由 */}
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-xl mb-3">なぜここまで安くできるのか？</h3>
            <ul className="space-y-2 text-gray-700 text-sm md:text-base">
              <li>・一次受付とよくある質問に機能を絞り、余計な機能を削っています。</li>
              <li>・AIが夜間・土日の受付を担当し、人件費を抑えています。</li>
              <li>・害虫駆除に特化したテンプレートで、設定やカスタマイズの工数を減らしています。</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">導入の流れ（10分で完了）</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-bold text-lg mb-2">フォーム記入</h3>
              <p className="text-gray-600">
                会社名・対応エリア・営業時間を入力（約3分）
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="font-bold text-lg mb-2">転送設定</h3>
              <p className="text-gray-600">
                既存の電話から専用番号に転送（約5分）<br />
                ※電話会社ごとの手順書と、画面共有でのサポートあり
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="font-bold text-lg mb-2">即日稼働</h3>
              <p className="text-gray-600">
                設定完了の連絡が届いたら、その日から24時間受付スタート
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-indigo-600 to-slate-800 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">害虫駆除業者向け導入相談はこちら</h2>
          <p className="text-lg md:text-xl text-indigo-100">
            ご都合のいいタイミングで、害虫駆除現場に合った使い方や導入ステップをご案内します。
            お問い合わせフォームまたはLINEでお気軽にご相談ください。
          </p>

          <div className="grid md:grid-cols-2 gap-8 mt-10 text-left">
            <div className="bg-white/90 text-slate-900 p-6 rounded-xl shadow-xl border border-white/60">
              <h3 className="font-bold text-2xl mb-4">ご相談の流れ</h3>
              <ol className="list-decimal list-inside space-y-2 text-base">
                <li>フォームから「日程調整希望」を送信</li>
                <li>担当が折り返し、ご希望の受付スタイルを確認</li>
                <li>オンラインでデモ＆導入準備のご案内</li>
              </ol>
            </div>

            <div className="bg-white/90 text-slate-900 p-6 rounded-xl shadow-xl border border-white/60 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-2xl mb-4">問い合わせ先</h3>
                <p className="text-base mb-2">メール：support@ai-secretary.site</p>
              </div>
              <a
                href="https://forms.gle/biQeiJtD1bSkLrSeA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg px-6 py-3 rounded-lg transition shadow-lg"
              >
                相談を始める →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">よくある質問</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2">Q. 既存の電話番号は変わりますか？</h3>
              <p className="text-gray-600">
                A. 変わりません。今お使いの番号から「転送設定」をするだけなので、そのままお使いいただけます。
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2">Q. 転送設定ができるか不安です。</h3>
              <p className="text-gray-600">
                A. 大手電話会社ごとの設定手順をまとめた資料をご用意しています。
                ご希望があれば、オンラインで画面を共有しながら一緒に設定することも可能です。
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2">Q. 本当に10分で使えますか？</h3>
              <p className="text-gray-600">
                A. フォーム入力と転送設定だけなので、慣れていれば10分程度で完了します。
                設定が終わり次第、その日からすぐに稼働します。
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2">Q. 通話内容はあとから確認できますか？</h3>
              <p className="text-gray-600">
                A. はい。すべての通話を自動で録音しており、管理画面から聞き返せます。
                録音を残したくない場合は、録音オフの設定も可能です。
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2">Q. 受付内容はどこで確認できますか？</h3>
              <p className="text-gray-600">
                A. メールまたはLINEで自動通知されるほか、管理画面で日付ごとに一覧表示できます。
                「誰が・いつ・どんな内容で電話してきたか」をひと目で確認できます。
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2">Q. 契約期間の縛りはありますか？</h3>
              <p className="text-gray-600">
                A. ありません。月額制サブスクですが、いつでも解約可能です。
                解約手数料などもかかりません。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="mb-4">害虫駆除業者向けAI電話受付サービス</p>
          <p className="text-sm text-gray-400">お問い合わせ: support@ai-secretary.site</p>
        </div>
      </footer>
    </div>
  );
}
