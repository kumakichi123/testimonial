'use client'
import Link from "next/link"
import { signIn } from "./actions"
import { useSearchParams } from "next/navigation"
import { Suspense } from 'react'

const inputStyles: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  fontSize: '16px',
  boxSizing: 'border-box',
  marginBottom: '16px'
}

function LoginForm() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <main>
      <div className="card" style={{ maxWidth: '400px', margin: '80px auto' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, textAlign: 'center', marginBottom: '32px' }}>ログイン</h1>
        <form action={signIn}>
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
          <button className="btn primary" type="submit" style={{ width: '100%', padding: '12px', fontSize: '16px' }}>ログイン</button>
        </form>
        {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '16px' }}>{error}</p>}
        <p style={{ textAlign: 'center', marginTop: '24px' }}>
          アカウントをお持ちでない方は <Link href="/signup" style={{ color: 'var(--primary-color)' }}>新規登録</Link>
        </p>
      </div>
    </main>
  )
}

export default function Login() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}

