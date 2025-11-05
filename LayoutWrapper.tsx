'use client'

import { usePathname } from 'next/navigation'
import Footer from '@/Footer'

const NO_FOOTER_PATHS = [
  '/login',
  '/auth-callback',
  '/form/',
  '/embed/',
]

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const showFooter = !NO_FOOTER_PATHS.some((path) => pathname.startsWith(path))

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">{children}</main>
      {showFooter && <Footer />}
    </div>
  )
}