import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "お客様の声",
};

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ルートレイアウト(app/layout.tsx)の内側にレンダリングされるため、
  // htmlとbodyタグは不要です。
  return <div className="h-full bg-white">{children}</div>;
}