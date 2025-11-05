'use client'

import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { signUp } from './actions'
import Link from 'next/link';

const inputStyles: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  fontSize: '16px',
  boxSizing: 'border-box',
  marginBottom: '16px'
}

function SignUpForm() {
  const searchParams = useSearchParams();
  const urlError = searchParams.get('error');

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(urlError);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const result = await signUp(formData);

    if (result.error) {
      setError(result.error);
    } else if (result.message) {
      setMessage(result.message);
    }
    setIsSubmitting(false);
  };

  return (
    <main>
      <div className="card" style={{ maxWidth: '400px', margin: '80px auto' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, textAlign: 'center', marginBottom: '32px' }}>新規登録</h1>
        <form onSubmit={handleSubmit}>
          <input
            name="companyName"
            placeholder="会社名"
            style={inputStyles}
          />
          <input
            name="email"
            placeholder="you@example.com"
            style={inputStyles}
          />
          <input
            type="password"
            name="password"
            placeholder="password"
            style={inputStyles}
          />
          <button className="btn primary" type="submit" disabled={isSubmitting || !!message} style={{ width: '100%', padding: '12px', fontSize: '16px' }}>
            {isSubmitting ? '処理中...' : (message ? 'メールをご確認ください' : '新規登録')}
          </button>
        </form>
        {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '16px' }}>{error}</p>}
        {message && <p style={{ color: 'blue', textAlign: 'center', marginTop: '16px' }}>{message}</p>}
        <p style={{ textAlign: 'center', marginTop: '24px' }}>
          すでにアカウントをお持ちの方は <Link href="/login" style={{ color: 'var(--primary-color)' }}>ログイン</Link>
        </p>
      </div>
    </main>
  )
}

export default function SignUp() {
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  )
}
