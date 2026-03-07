import type { Metadata, Viewport } from 'next'
import { Noto_Sans_KR, Noto_Serif_KR } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  variable: '--font-noto-sans',
  weight: ['300', '400', '500', '700'],
})

const notoSerifKR = Noto_Serif_KR({
  subsets: ['latin'],
  variable: '--font-noto-serif',
  weight: ['400', '600', '700'],
})

export const metadata: Metadata = {
  title: 'CureForest | 큐어포레스트 - 산림치유 힐링 프로그램',
  description: '산림치유를 통해 몸과 마음의 건강을 회복하는 힐링 프로그램. 치유의 숲에서 자연과 함께하는 특별한 경험을 만나보세요.',
}

export const viewport: Viewport = {
  themeColor: '#4a7c59',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${notoSansKR.variable} ${notoSerifKR.variable} font-sans antialiased`} suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
