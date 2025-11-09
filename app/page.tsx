'use client';

import React, { useState } from 'react';
import { Shield, Zap, TrendingUp, Check, ArrowRight, Heart, FileText } from 'lucide-react';

export default function FuneralLP() {
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
      setErrorMessage('会社名とメールアドレスを入力してください。');
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
        throw new Error(
          payload && typeof payload.error === 'string'
            ? payload.error
            : '送信に失敗しました。もう一度お試しください。'
        );
      }

      setSubmitted(true);
      setEmail('');
      setCompany('');
      setErrorMessage(null);
    } catch (error) {
      console.error('lp-lead submit error', error);
      setErrorMessage(
        error instanceof Error ? error.message : '送信に失敗しました。もう一度お試しください。'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* ヒーロー */}
      <header className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-block bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            β版モニター募集中（先着10社様限定｜永久半額）
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            ご葬儀後のアンケート、<br />
            <span className="text-indigo-600">AIで整形しサイトに自動反映</span>
          </h1>

          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            ご遺族様の声を収集→AI整形→掲載までを自動化。<br />
            葬儀社様の信頼を可視化し、問い合わせ増加に直結。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => document.getElementById('beta')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
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
            <div className="flex items-center gap-2"><Check className="w-5 h-5 text-indigo-600" /> 設置3分</div>
            <div className="flex items-center gap-2"><Check className="w-5 h-5 text-indigo-600" /> 月額9,800円</div>
            <div className="flex items-center gap-2"><Check className="w-5 h-5 text-indigo-600" /> β版は<strong>永久半額</strong></div>
            <div className="flex items-center gap-2"><Check className="w-5 h-5 text-indigo-600" /> 解約自由</div>
          </div>
        </div>
      </header>

      {/* 課題セクション */}
      <section className="bg-slate-100 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">こんなお悩みありませんか？</h2>
          <div className="space-y-4">
            {[
              'ご葬儀後のアンケートを取っても、サイトに反映できていない',
              'お客様の声を載せたいが、手入力や更新依頼が負担',
              '外注更新は時間も費用もかかり、タイムリーに反映されない',
              '信頼を示す実績・お声を整えて届ける方法がわからない',
              'Googleの口コミはあるが、公式サイトに活かせていない',
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
            アンケートURLを送るだけですべて自動化
          </h2>
        <p className="text-center text-slate-600 mb-12">3ステップで完了。現場の負担ゼロ。</p>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-indigo-600">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">ご葬儀後にURL送付</h3>
              <p className="text-slate-600">ご遺族様へメールやLINEでアンケートURLを送付。1分で完了。</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-indigo-600">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">AIが自動で整形</h3>
              <p className="text-slate-600">誤字修正・個人名や連絡先のマスク・文章整形を自動化。文意は改ざんしません。</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-indigo-600">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">サイトへ自動反映</h3>
              <p className="text-slate-600">承認後に公式サイトへ自動掲載。更新依頼・反映待ちは不要です。</p>
            </div>
          </div>

          {/* 主要機能 */}
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { icon: Heart, title: '配慮ある表現', desc: '弔意に配慮したトーンで整形。不要な個人情報は自動で伏せ字。' },
              { icon: Shield, title: '信頼の可視化', desc: '最新のご遺族様の声で選ばれる理由を明確化。' },
              { icon: Zap, title: '作業時間ゼロ', desc: 'URL送信のみ。現場の負担を増やしません。' },
              { icon: TrendingUp, title: 'SEO効果', desc: '新しい声の蓄積でロングテール流入が増加。' },
            ].map((feature, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-indigo-600" />
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



      {/* 価格（β版＝永久半額を強調） */}
      <section className="bg-slate-100 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">シンプルな料金プラン</h2>

          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border-4 border-indigo-500 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-2 rounded-full font-bold">
              β版モニター 永久半額 50% OFF
            </div>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4 text-slate-900">β版モニタープラン</h3>
              <div className="flex items-baseline justify-center gap-3 mb-2">
                <span className="text-6xl font-black text-indigo-600">¥4,900</span>
                <span className="text-slate-600">/月</span>
              </div>
              <div className="text-sm text-slate-500">
                通常 <span className="line-through">¥9,800/月</span>
                <span className="ml-2 inline-flex items-center rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-xs font-semibold">先着10社</span>
              </div>
              <p className="text-slate-600 mt-2">永年¥4,900/月・解約自由</p>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                'アンケートURL無制限発行',
                'AI自動整形（誤字修正・個人情報マスク）',
                'メールサポート',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>

            <div className="text-center">
              <p className="text-sm text-slate-600 mb-4">β版は <strong className="text-indigo-600">永久半額（¥4,900/月）</strong>・先着10社限定</p>
              <button
                onClick={() => document.getElementById('beta')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-indigo-700 transition"
              >
                今すぐ申し込む
              </button>
              <p className="text-xs text-slate-500 mt-3">※ β参加企業は解約しない限りずっと¥4,900/月。いつでも解約可</p>
            </div>
          </div>
        </div>
      </section>

      {/* β版モニター募集 */}
      <section className="py-16" id="beta">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-8 md:p-12 text-white shadow-2xl">
            <h2 className="text-3xl font-bold mb-4 text-center">β版モニター募集</h2>
            <p className="text-center mb-2 text-indigo-100 text-lg">先着10社様限定で<strong>永久半額</strong></p>
            <p className="text-center mb-8 text-indigo-100">フィードバックをいただける葬儀社様を募集しています</p>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-2 font-medium">会社名</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg text-slate-900"
                    placeholder="株式会社テスティモ葬祭"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">メールアドレス</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg text-slate-900"
                    placeholder="contact@example.com"
                  />
                </div>

                {errorMessage ? (
                  <p className="text-sm text-center text-rose-100">{errorMessage}</p>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-indigo-600 px-8 py-4 rounded-lg font-bold text-lg transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? 'Sending...' : '無料で申し込む'}
                </button>

                <p className="text-sm text-center text-indigo-100">※ 24時間以内にご連絡いたします</p>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-10 h-10 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Thank you!</h3>
                <p className="text-indigo-100">24時間以内にご連絡します。</p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setErrorMessage(null);
                  }}
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  もう一度送信する
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-100 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Q&A</h2>
          <div className="space-y-6">
            {[
              {
                q: '本当に3分で設置できますか？',
                a: 'はい。発行されたiframeコードを貼るだけです。WordPressは投稿や固定ページの「カスタムHTML」に貼れば完了します。',
              },
              {
                q: 'WordPress以外でも使えますか？',
                a: 'はい。Wix、Jimdo、Shopify、独自HTMLサイトなど、iframeが使えるサイトなら対応します。',
              },
              {
                q: 'AI整形で表現が変わりませんか？',
                a: '文意は変えません。誤字修正と個人情報のマスク、読みやすい体裁のみを行います。公開前に必ず承認できます。',
              },
              {
                q: '個人情報や実名の扱いは？',
                a: '氏名・住所・電話などは既定で伏せ字処理します。設定で社内のみ原文確認も可能です。',
              },
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
          <h3 className="text-2xl font-bold mb-4">葬儀社様の信頼を、確かな言葉で。</h3>
          <p className="text-slate-400 mb-8">β版モニター募集中（先着10社・永久半額／通常¥9,800→¥4,900）</p>
          <button
            onClick={() => document.getElementById('beta')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-indigo-700 transition"
          >
            今すぐ申し込む
          </button>
        </div>
      </footer>
    </div>
  );
}
