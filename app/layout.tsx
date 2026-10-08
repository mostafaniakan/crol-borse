import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "رادار سهم | غربالگری چندمنبعی بازار",
  description: "غربالگری شرکت‌ها با ترکیب فروش بازار، کیفیت مالی و داده معاملات.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="antialiased">{children}</body>
    </html>
  );
}
