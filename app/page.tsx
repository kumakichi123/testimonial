'use client';

import React, { useState } from 'react';
import { Shield, Zap, TrendingUp, Check, Star, ArrowRight } from 'lucide-react';

export default function PestControlLP() {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedCompany = company.trim();

    if (!trimmedEmail || !trimmedCompany) {
      setErrorMessage('Please enter a company name and email address.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/lp-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, company: trimmedCompany }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload && typeof payload.error === 'string' ? payload.error : 'Failed to submit. Please try again.');
      }

      setSubmitted(true);
      setEmail('');
      setCompany('');
      setErrorMessage(null);
    } catch (error) {
      console.error('lp-lead submit error', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* ヒーロー */}
      <header className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-block bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            β版モニター募集中（先着10社様限定）
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            施工後のアンケート、<br />
            <span className="text-emerald-600">自動でサイトに反映</span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            お客様の声を収集→AI整形→サイト掲載まで全自動。<br />
            害虫駆除業者様の信頼性を高め、問い合わせを増やします。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button 
              onClick={() => document.getElementById('beta')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-emerald-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-emerald-700 transition flex items-center justify-center gap-2"
            >
              無料で試してみる
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-slate-700 px-8 py-4 rounded-lg font-bold text-lg border-2 border-slate-200 hover:border-slate-300 transition"
            >
              詳しく見る
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-600" />
              設置3分
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-600" />
              月額2,980円
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-600" />
              解約自由
            </div>
          </div>
        </div>
      </header>

      {/* 課題セクション */}
      <section className="bg-slate-100 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">
            こんなお悩みありませんか？
          </h2>
          
          <div className="space-y-4">
            {[
              '施工後のアンケートを取っても、サイトに反映できていない',
              'お客様の声を載せたいが、手入力が面倒で放置している',
              'ホームページの更新を外注に頼むとコストがかかる',
              '信頼性をアピールしたいが、方法がわからない',
              'Google口コミは良いのに、サイトには反映されていない'
            ].map((problem, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <p className="text-slate-700 text-lg">❌ {problem}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ソリューション */}
      <section className="py-16" id="features">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4 text-slate-900">
            アンケートURLを送るだけで<br />すべて自動化
          </h2>
          <p className="text-center text-slate-600 mb-12">3ステップで完了。面倒な作業はゼロ。</p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-emerald-600">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">施工完了後にURL送信</h3>
              <p className="text-slate-600">
                施工完了後、お客様にアンケートURLをメールやLINEで送信。1分で完了。
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-emerald-600">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">AIが自動で整形</h3>
              <p className="text-slate-600">
                回答があれば、AIが自動で誤字修正・個人情報マスク。プロの文章に。
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-emerald-600">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">サイトに自動反映</h3>
              <p className="text-slate-600">
                あなたが承認すれば、自動でホームページに表示。更新作業ゼロ。
              </p>
            </div>
          </div>

          {/* 主要機能 */}
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: Shield,
                title: '信頼性が向上',
                desc: 'リアルなお客様の声で「この業者、信頼できる」と思ってもらえます'
              },
              {
                icon: Zap,
                title: '作業時間ゼロ',
                desc: 'URL送信だけ。あとは全自動。月1時間の作業が1分に。'
              },
              {
                icon: TrendingUp,
                title: 'SEO効果',
                desc: 'お客様の声が増えると、Google検索で上位表示されやすくなります'
              },
              {
                icon: Star,
                title: '承認システム',
                desc: '公開前にあなたが確認。不適切な内容は非公開にできます'
              }
            ].map((feature, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 価格 */}
      <section className="bg-slate-100 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">
            シンプルな料金プラン
          </h2>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border-4 border-emerald-500 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white px-6 py-2 rounded-full font-bold">
              おすすめ
            </div>
            
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4 text-slate-900">スタンダードプラン</h3>
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-5xl font-bold text-slate-900">¥2,980</span>
                <span className="text-slate-600">/月</span>
              </div>
              <p className="text-slate-600">月額制・いつでも解約可能</p>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                'アンケートURL無制限発行',
                'AI自動整形（誤字修正・個人情報マスク）',
                'iframe埋め込みコード提供',
                '月20件まで公開可能',
                '承認システム',
                'メールサポート'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>

            <div className="text-center">
              <p className="text-sm text-slate-600 mb-4">
                今なら<strong className="text-emerald-600">初月無料</strong>（β版モニター限定）
              </p>
              <button 
                onClick={() => document.getElementById('beta')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-block bg-emerald-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-emerald-700 transition"
              >
                今すぐ申し込む
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* β版モニター募集 */}
      <section className="py-16" id="beta">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-8 md:p-12 text-white shadow-2xl">
            <h2 className="text-3xl font-bold mb-4 text-center">
              β版モニター募集
            </h2>
            <p className="text-center mb-2 text-emerald-100 text-lg">
              先着10社様限定で<strong>初月無料</strong>
            </p>
            <p className="text-center mb-8 text-emerald-100">
              フィードバックをいただける害虫駆除業者様を募集中
            </p>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-2 font-medium">会社名</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg text-slate-900"
                    placeholder="株式会社テスト"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">メールアドレス</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg text-slate-900"
                    placeholder="your@email.com"
                  />
                </div>

                {errorMessage ? (
                  <p className="text-sm text-center text-rose-100">{errorMessage}</p>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-emerald-600 px-8 py-4 rounded-lg font-bold text-lg transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? 'Sending...' : 'Join the beta for free'}
                </button>

                <p className="text-sm text-center text-emerald-100">
                  ※ 24時間以内にご連絡いたします
                </p>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Thank you!</h3>
                <p className="text-emerald-100">
                  We will get in touch within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => { setSubmitted(false); setErrorMessage(null); }}
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  Submit another lead
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-100 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">
            よくある質問
          </h2>
          
          <div className="space-y-6">
            {[
              {
                q: '本当に3分で設置できますか？',
                a: 'はい。発行されたiframeコードをホームページに貼り付けるだけです。WordPressなら投稿画面に貼るだけで完了します。'
              },
              {
                q: 'WordPress以外でも使えますか？',
                a: 'はい。Wix、Jimdo、Shopify、独自HTMLサイトなど、iframeが使えるサイトならすべて対応しています。'
              },
              {
                q: 'AIの整形で内容が変わりませんか？',
                a: '意味は変えず、誤字修正と個人情報のマスクのみです。公開前にあなたが確認・承認するので安心です。'
              },
              {
                q: '解約したらデータはどうなりますか？',
                a: '解約後もサイトに表示されたままです。ただし新規追加はできなくなります。'
              },
              {
                q: '本当にSEO効果がありますか？',
                a: 'お客様の声が増えると、Googleが「信頼できるサイト」と判断しやすくなります。ただし即効性はなく、3-6ヶ月かけて徐々に効果が出ます。'
              }
            ].map((faq, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-lg mb-2 text-slate-900">Q. {faq.q}</h3>
                <p className="text-slate-600">A. {faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">
            害虫駆除業者様の信頼性を高める
          </h3>
          <p className="text-slate-400 mb-8">
            β版モニター募集中（先着10社様限定・初月無料）
          </p>
          <button 
            onClick={() => document.getElementById('beta')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-block bg-emerald-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-emerald-700 transition"
          >
            今すぐ申し込む
          </button>
          
          <div className="mt-12 pt-8 border-t border-slate-800 text-slate-500 text-sm">
            <p>© 2025 お客様の声自動化ツール. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
