import './globals.css'

import type { Metadata } from 'next'
// eslint-disable-next-line camelcase
import { Geist, Geist_Mono } from 'next/font/google'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  // title: 'Stepp.per',
  title: {
    template: '%s | Stepp.per',
    default: 'Stepp.per',
  },
  description:
    'A multi-step form solution built with Next.js 15, React 19, and TypeScript. Using shadcn components, react-hook-form for handling form state, Zod for validation, and styled with Tailwind CSS and more!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
