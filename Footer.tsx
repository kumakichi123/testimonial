import Link from 'next/link'

const Footer = () => {
  const footerLinks = [
    { href: '/terms', label: '利用規約' },
    { href: '/privacy', label: 'プライバシーポリシー' },
    { href: '/tokushoho', label: '特定商取引法に基づく表記' },
    { href: '/cookie', label: 'クッキーポリシー' },
    { href: '/contact', label: 'お問い合わせ' },
  ]

  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center gap-x-16 gap-y-4 text-sm text-gray-600">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1 hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <p className="text-center text-xs text-gray-500 mt-8">
          &copy; {new Date().getFullYear()} テスティモ. All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
