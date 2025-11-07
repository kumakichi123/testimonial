import "./globals.css"
import LayoutWrapper from "@/LayoutWrapper"

export const metadata = { title: "テスティモ" }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  )
}
