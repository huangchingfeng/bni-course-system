import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { SessionProvider } from "@/components/providers/SessionProvider"
import { Header } from "@/components/layout/Header"
import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "BNI 新北市西B區 | 課程報名系統",
  description: "BNI 新北市西B區課程報名平台，輕鬆瀏覽、搜尋、報名各類培訓課程。Excellence Through Connection - 卓越源於連結",
  keywords: ["BNI", "新北市", "課程報名", "商業網絡", "培訓", "引薦"],
  authors: [{ name: "BNI Xinbei West B" }],
  openGraph: {
    title: "BNI 新北市西B區 | 課程報名系統",
    description: "專業培訓，卓越成長。Excellence Through Connection - 卓越源於連結",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-TW">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <SessionProvider>
          <Header />
          <main>{children}</main>
          <Toaster position="top-center" />
        </SessionProvider>
      </body>
    </html>
  )
}
