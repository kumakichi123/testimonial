'use client';

import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({ company: '', email: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.company.trim() || !formData.email.trim()) {
      setError('会社名とメールアドレスを入力してください。');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/lp-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('送信に失敗しました。もう一度お試しください。');
      }

      setSubmitted(true);
      setFormData({ company: '', email: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : '送信に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <style jsx>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Noto Sans JP', sans-serif; color: #2c3e50; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        header { background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%); padding: 60px 20px; text-align: center; }
        .hero-badge { display: inline-block; background: #e0e7ff; color: #4c1d95; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; margin-bottom: 24px; }
        h1 { font-size: 48px; font-weight: 700; margin-bottom: 24px; line-height: 1.2; }
        .hero-highlight { color: #4f46e5; }
        .hero-desc { font-size: 20px; color: #64748b; margin-bottom: 32px; line-height: 1.6; }
        .hero-buttons { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-bottom: 32px; }
        .btn { padding: 16px 32px; font-size: 16px; font-weight: 600; border: none; border-radius: 8px; cursor: pointer; transition: all 0.3s; font-family: 'Noto Sans JP', sans-serif; }
        .btn-primary { background: #4f46e5; color: white; }
        .btn-primary:hover { background: #4338ca; }
        .btn-secondary { background: white; color: #1e293b; border: 2px solid #cbd5e1; }
        .btn-secondary:hover { border-color: #94a3b8; }
        .hero-features { display: flex; flex-wrap: wrap; gap: 24px; justify-content: center; font-size: 14px; color: #64748b; }
        .hero-features div { display: flex; align-items: center; gap: 8px; }
        .check { color: #4f46e5; font-weight: 700; }
        section { padding: 60px 20px; }
        h2 { font-size: 36px; font-weight: 700; text-align: center; margin-bottom: 48px; }
        .problems { background: #f1f5f9; }
        .problem-list { display: grid; gap: 16px; }
        .problem-item { background: white; padding: 24px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 16px; }
        .steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-bottom: 48px; }
        .step { background: white; padding: 32px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); transition: transform 0.3s; }
        .step:hover { transform: translateY(-4px); }
        .step-number { width: 48px; height: 48px; background: #e0e7ff; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 700; color: #4f46e5; margin-bottom: 16px; }
        .step h3 { font-size: 18px; margin-bottom: 12px; }
        .step p { color: #64748b; font-size: 14px; }
        .demo-section { margin-bottom: 48px; }
        .demo-section h3 { font-size: 24px; font-weight: 600; margin-bottom: 24px; color: #1e293b; }
        .demo-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 32px; }
        .demo-card { background: white; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); }
        .demo-preview { background: #f8fafc; padding: 24px; min-height: 300px; display: flex; align-items: center; justify-content: center; border-bottom: 1px solid #e2e8f0; }
        .demo-card-content { padding: 24px; }
        .demo-card h4 { font-size: 16px; font-weight: 600; margin-bottom: 8px; color: #1e293b; }
        .demo-card p { font-size: 14px; color: #64748b; }
        .testimony-sample { background: white; padding: 16px; border-left: 4px solid #4f46e5; border-radius: 4px; }
        .testimony-text { font-size: 14px; color: #2c3e50; line-height: 1.6; margin-bottom: 8px; }
        .testimony-meta { font-size: 12px; color: #64748b; }
        .pdf-preview { background: white; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; font-size: 12px; color: #2c3e50; line-height: 1.5; }
        .pdf-header { border-bottom: 2px solid #4f46e5; padding-bottom: 12px; margin-bottom: 12px; font-weight: 600; }
        .pdf-stat { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; text-align: center; }
        .pdf-stat-box { background: #f0f4ff; padding: 8px; border-radius: 4px; }
        .pdf-stat-number { font-size: 16px; font-weight: 700; color: #4f46e5; }
        .pdf-stat-label { font-size: 11px; color: #64748b; }
        .pricing { background: #f1f5f9; }
        .pricing-card { background: white; border-radius: 16px; border: 4px solid #4f46e5; padding: 48px 32px; text-align: center; max-width: 600px; margin: 0 auto; position: relative; }
        .pricing-badge { position: absolute; top: -20px; left: 50%; transform: translateX(-50%); background: #4f46e5; color: white; padding: 8px 16px; border-radius: 20px; font-weight: 600; font-size: 13px; }
        .pricing-title { font-size: 24px; font-weight: 600; margin-bottom: 16px; margin-top: 16px; }
        .price-display { display: flex; align-items: baseline; justify-content: center; gap: 8px; margin-bottom: 8px; }
        .price-amount { font-size: 56px; font-weight: 900; color: #4f46e5; }
        .price-period { color: #64748b; }
        .price-note { font-size: 13px; color: #64748b; margin-bottom: 16px; }
        .price-note .normal { text-decoration: line-through; }
        .price-note .limited { display: inline-block; background: #fef08a; color: #713f12; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; margin-left: 8px; }
        .price-note-line { color: #64748b; font-size: 14px; margin-bottom: 24px; }
        .feature-list { text-align: left; margin-bottom: 32px; }
        .feature-list li { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
        .feature-list li:last-child { border-bottom: none; }
        .checkmark { color: #4f46e5; font-weight: 700; }
        .pricing-cta { margin-top: 32px; }
        .disclaimer { font-size: 11px; color: #94a3b8; margin-top: 12px; }
        .beta { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; }
        .beta-content { background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border-radius: 16px; padding: 48px 32px; max-width: 600px; margin: 0 auto; }
        .beta h2 { color: white; }
        .beta-desc { text-align: center; margin-bottom: 32px; }
        .beta-desc p { font-size: 16px; margin-bottom: 8px; color: rgba(255, 255, 255, 0.9); }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; margin-bottom: 8px; font-weight: 500; font-size: 14px; }
        .form-group input { 
          width: 100%; 
          padding: 12px 16px; 
          border: none; 
          border-radius: 8px; 
          font-size: 14px; 
          font-family: 'Noto Sans JP', sans-serif;
          color: #1e293b; // ← これを追加
        }
        .form-submit { width: 100%; background: white; color: #4f46e5; padding: 14px 24px; border: none; border-radius: 8px; font-weight: 600; font-size: 16px; cursor: pointer; transition: all 0.3s; font-family: 'Noto Sans JP', sans-serif; }
        .form-submit:hover { background: #f1f5f9; }
        .form-note { text-align: center; font-size: 12px; color: rgba(255, 255, 255, 0.8); margin-top: 12px; }
        .error-message { text-align: center; font-size: 13px; color: #fca5a5; margin-bottom: 16px; }
        .success-message { text-align: center; }
        .success-icon { width: 64px; height: 64px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 36px; }
        .success-message h3 { font-size: 24px; font-weight: 700; margin-bottom: 8px; }
        .success-message p { color: rgba(255, 255, 255, 0.9); }
        .faq { background: #f1f5f9; }
        .faq-list { max-width: 800px; margin: 0 auto; display: grid; gap: 16px; }
        .faq-item { background: white; padding: 24px; border-radius: 8px; border: 1px solid #e2e8f0; }
        .faq-q { font-weight: 600; margin-bottom: 12px; color: #1e293b; }
        .faq-a { color: #64748b; font-size: 14px; line-height: 1.6; }
        footer { background: #1e293b; color: white; padding: 48px 20px; text-align: center; }
        footer h3 { font-size: 24px; margin-bottom: 16px; }
        footer p { color: #94a3b8; margin-bottom: 24px; }
        @media (max-width: 768px) {
          h1 { font-size: 32px; }
          h2 { font-size: 28px; }
          .price-amount { font-size: 42px; }
          .steps { grid-template-columns: 1fr; }
          .demo-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <header>
        <div className="container">
          <div className="hero-badge">β版モニター募集中（先着10社様限定｜永久半額）</div>
          <h1>
            ご遺族様の声を、<br />
            <span className="hero-highlight">サイトと営業に自動反映</span>
          </h1>
          <p className="hero-desc">
            アンケート収集→AI整形→ご遺族様の声とPDF自動生成。<br />
            サイトにも営業資料にも最新の信頼の声が反映される。
          </p>
          <div className="hero-buttons">
            <button className="btn btn-secondary" onClick={() => scrollToSection('beta')}>
              β版に登録する
            </button>
          </div>
          <div className="hero-features">
            <div><span className="check">✓</span> コピペだけで設置</div>
            <div><span className="check">✓</span> β版は永久半額</div>
            <div><span className="check">✓</span> 解約自由</div>
          </div>
        </div>
      </header>

      <section className="problems">
        <div className="container">
          <h2>こんなお悩みありませんか？</h2>
          <div className="problem-list">
            <div className="problem-item">❌ ご葬儀後のアンケートを取っても、サイトに反映できていない</div>
            <div className="problem-item">❌ ご遺族様の声を営業時に見せたいが、うまく作れない</div>
            <div className="problem-item">❌ 見積もり提示時に信頼の証拠を見せる方法がない</div>
            <div className="problem-item">❌ サイトも営業資料も、手動で更新しないといけない</div>
            <div className="problem-item">❌ Googleの口コミはあるが、自社サイトに活かせていない</div>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <h2>3ステップで完全自動化</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>URL送付</h3>
              <p>ご遺族様へアンケートURLを送付。</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>AI整形</h3>
              <p>誤字修正・個人情報マスク・文章整形を自動化。</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>自動反映</h3>
              <p>承認後、サイトへ掲載＆PDFダウンロード可能に。</p>
            </div>
          </div>
        </div>
      </section>
<section id="voices" className="section">
  <div className="container">
    <h2>ご遺族様の声の表示例</h2>

    {/* 参考イメージのみ表示（iframeは削除） */}
    <figure
      style={{
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        overflow: 'hidden',
        background: '#fff',
      }}
    >
      {/* public/ 配下は /images/ で参照する */}
      <img
        src="/images/voices-sample.jpg"
        alt="ご遺族様の声の表示例（参考画像）"
        style={{ display: 'block', width: '100%', height: 'auto' }}
      />
      <figcaption
        style={{
          padding: '8px 12px',
          fontSize: 12,
          color: '#64748b',
          borderTop: '1px solid #e2e8f0',
          background: '#f8fafc',
        }}
      >
        
      </figcaption>
    </figure>

    <p className="note" style={{ marginTop: 10 }}>
      画像はイメージです。実運用では埋め込みウィジェットで自動更新されます。
    </p>
  </div>
</section>



{/* 営業PDF（表示例：srcDocで埋め込み） */}
<section id="pdf" className="section">
  <div className="container">
    <h2>営業PDF（表示例）</h2>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: 20,
      }}
    >
      <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
<iframe
  title="営業資料プレビュー"
  srcDoc={`<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>葬儀社 営業資料</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Noto Sans JP','Segoe UI',sans-serif;line-height:1.6;color:#1f2937;background:#f5f5f5}
    .page{width:210mm;height:297mm;margin:10px auto;background:#fff;padding:40px;box-shadow:0 0 10px rgba(0,0,0,.1)}
    .header{text-align:center;border-bottom:3px solid #6366f1;padding-bottom:16px;margin-bottom:18px}
    .company-name{font-size:24px;font-weight:700;color:#1e293b;margin-bottom:4px}
    .subtitle{color:#64748b;font-size:14px}
    .hero{width:100%;height:80mm;margin:14px 0 18px;overflow:hidden;border-radius:8px}
    .hero img{width:100%;height:100%;object-fit:cover;filter:saturate(.9)}
    .section-title{font-size:18px;font-weight:700;color:#1e293b;margin:10px 0 12px;border-left:4px solid #6366f1;padding-left:10px}
    .testimonial-wrap{display:grid;grid-template-columns:1.6fr 1fr;gap:16px;align-items:start}
    .detail{width:100%;max-height:55mm;overflow:hidden;border:1px solid #e2e8f0;border-radius:8px;background:#fff}
    .detail img{width:100%;height:100%;object-fit:cover;filter:saturate(.9) contrast(1.02)}
    .testimonial-section{background:#f8fafc;padding:20px;border-radius:8px}
    .testimonial{background:#fff;padding:15px;margin-bottom:12px;border-left:4px solid #6366f1;border-radius:4px}
    .testimonial-text{color:#1f2937;font-size:14px;margin-bottom:8px;line-height:1.7}
    .testimonial-meta{font-size:12px;color:#64748b}
    .stats{display:grid;grid-template-columns:1fr 1fr;gap:15px;margin:18px 0}
    .stat-box{background:#eef2ff;padding:15px;border-radius:8px;text-align:center}
    .stat-number{font-size:28px;font-weight:700;color:#6366f1;margin-bottom:5px}
    .stat-label{font-size:13px;color:#64748b}
    /* ▼ 箇条書きのズレ解消：左端を見出しと揃える */
    .features{margin:0;padding-left:1.2em;list-style-position:outside}
    .features li{margin:0 0 8px}
    .qr-section{text-align:center;margin-top:16px;padding:16px;background:#f8fafc;border-radius:8px}
    .qr-box{width:120px;height:120px;margin:0 auto 10px;background:#e2e8f0;border:1px solid #cbd5e1;display:flex;align-items:center;justify-content:center;color:#64748b;font-size:12px;border-radius:4px}
    .qr-label{font-size:12px;color:#64748b}
    .footer{margin-top:24px;text-align:center;border-top:1px solid #e2e8f0;padding-top:12px;font-size:11px;color:#94a3b8}
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="company-name">○○葬儀社</div>
      <div class="subtitle">選ばれる理由</div>
    </div>

    <figure class="hero">
      <img src="/images/chapel-interior.jpg" alt="式場内観の横長写真">
    </figure>

    <div class="section-title">ご遺族様からの声</div>
    <div class="testimonial-wrap">
      <div class="testimonial-section">
        <div class="testimonial">
          <div class="testimonial-text">「突然のことで戸惑っていましたが、担当者の方が丁寧に対応してくれて安心できました。細かい要望にも応じてくださり、父もきっと喜んでいると思います。」</div>
          <div class="testimonial-meta">60代 ご遺族様（2025年2月）</div>
        </div>
        <div class="testimonial">
          <div class="testimonial-text">「説明が分かりやすく、相談しやすい雰囲気でした。急いでいる中でも親身に対応いただき、本当に感謝しています。」</div>
          <div class="testimonial-meta">50代 ご遺族様（2025年1月）</div>
        </div>
        <div class="testimonial">
          <div class="testimonial-text">「葬儀の流れから故人の想いに沿ったプラン提案まで、全てにおいて満足できました。スタッフさんの心遣いが素晴らしかったです。」</div>
          <div class="testimonial-meta">70代 ご遺族様（2024年12月）</div>
        </div>
      </div>
      <figure class="detail">
        <img src="/images/altar-detail.jpg" alt="祭壇と供花のディテール写真">
      </figure>
    </div>

    <div class="stats">
      <div class="stat-box"><div class="stat-number">98%</div><div class="stat-label">ご遺族様満足度</div></div>
      <div class="stat-box"><div class="stat-number">25年</div><div class="stat-label">地域密着の実績</div></div>
    </div>

    <div class="section-title">当社の特徴</div>
    <ul class="features">
      <li>24時間対応・急なご依頼にも即座に対応</li>
      <li>葬儀プランは10万円～対応可能</li>
      <li>故人様のご意思を尊重した自由なプラン設計</li>
      <li>法務相談・供花手配・返礼品選定まで一括サポート</li>
    </ul>

    <div class="qr-section">
      <div class="qr-box">QRコード</div>
      <div class="qr-label">詳しくはこちら</div>
    </div>

    <div class="footer">© 2025 ○○葬儀社 | 本資料はご遺族様のアンケートから自動生成されました</div>
  </div>
</body>
</html>`}
  style={{ width: '100%', height: 500, border: 0 }}
/>


      </div>

      <div className="card">
        <h3>この資料の使い方(例)</h3>
        <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.9 }}>
          ・見積書に同封してご検討者へ配布<br />
          ・式場見学後のフォローでメール添付<br />
          ・QRから自社サイトへ誘導<br />
          ・パンフレットにして配布
        </p>
      </div>
    </div>
  </div>
</section>

      <section className="pricing">
        <div className="container">
          <h2>シンプルな料金プラン</h2>
          <div className="pricing-card">
            <div className="pricing-badge">β版モニター 永久半額 50% OFF</div>
            <div className="pricing-title">β版モニタープラン</div>
            <div className="price-display">
              <span className="price-amount">¥4,980</span>
              <span className="price-period">/月</span>
            </div>
            <div className="price-note">
              通常 <span className="normal">¥9,960/月</span>
              <span className="limited">先着10社</span>
            </div>
            <p className="price-note-line">永年¥4,980/月・解約自由</p>

            <ul className="feature-list">
              <li><span className="checkmark">✓</span> アンケートURL無制限発行</li>
              <li><span className="checkmark">✓</span> AI自動整形（誤字修正・個人情報マスク）</li>
              <li><span className="checkmark">✓</span> サイト掲載用フォーマット自動生成</li>
              <li><span className="checkmark">✓</span> 営業用PDF生成</li>
              <li><span className="checkmark">✓</span> メールサポート</li>
            </ul>

            <div className="pricing-cta">
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => scrollToSection('beta')}>
                今すぐ申し込む
              </button>
              <p className="disclaimer">※ β参加企業は解約しない限りずっと¥4,980/月。いつでも解約可</p>
            </div>
          </div>
        </div>
      </section>

      <section className="beta" id="beta">
        <div className="container">
          <h2 style={{ color: 'white' }}>β版モニター募集</h2>
          <div className="beta-content">
            <div className="beta-desc">
              <p><strong>先着10社様限定で永久半額</strong></p>
              <p>フィードバックをいただける葬儀社様を募集しています</p>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>会社名</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="株式会社ノーテリア葬祭"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>メールアドレス</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contact@example.com"
                    required
                  />
                </div>

                {error && <p className="error-message">{error}</p>}

                <button type="submit" className="form-submit" disabled={loading}>
                  {loading ? '送信中...' : '無料で申し込む'}
                </button>
                <p className="form-note">※ 24時間以内にご連絡いたします</p>
              </form>
            ) : (
              <div className="success-message">
                <div className="success-icon">✓</div>
                <h3>Thank you!</h3>
                <p>24時間以内にご連絡します。</p>
                <button
                  className="btn btn-secondary"
                  style={{ marginTop: '24px' }}
                  onClick={() => setSubmitted(false)}
                >
                  もう一度送信する
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="faq">
        <div className="container">
          <h2>Q&A</h2>
          <div className="faq-list">
            <div className="faq-item">
              <div className="faq-q">Q. 本当に3分で設置できますか？</div>
              <div className="faq-a">A. はい。発行されたiframeコードを貼るだけです。WordPressは投稿や固定ページの「カスタムHTML」に貼れば完了します。</div>
            </div>
            <div className="faq-item">
              <div className="faq-q">Q. サイトとPDF、両方に自動で反映されるんですか？</div>
              <div className="faq-a">A. はい。アンケートを承認すると、サイト用とPDF用の両フォーマットが自動生成されます。営業時はPDFをダウンロードして印刷するだけです。</div>
            </div>
            <div className="faq-item">
              <div className="faq-q">Q. AI整形で表現が変わりませんか？</div>
              <div className="faq-a">A. 文意は変えません。誤字修正と個人情報のマスク、読みやすい体裁のみを行います。公開前に必ず承認できます。</div>
            </div>
            <div className="faq-item">
              <div className="faq-q">Q. 個人情報や実名の扱いは？</div>
              <div className="faq-a">A. 氏名・住所・電話などは既定で伏せ字処理します。設定で社内のみ原文確認も可能です。</div>
            </div>
            <div className="faq-item">
              <div className="faq-q">Q. WordPress以外でも使えますか？</div>
              <div className="faq-a">A. はい。Wix、Jimdo、Shopify、独自HTMLサイトなど、iframeが使えるサイトなら対応します。</div>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <h3>ご遺族様の声を、信頼の証に。</h3>
          <p>β版モニター募集中（先着10社・永久半額／通常¥9,960→¥4,980）</p>
          <button className="btn btn-primary" onClick={() => scrollToSection('beta')}>
            今すぐ申し込む
          </button>
        </div>
      </footer>
    </div>
  );
}
