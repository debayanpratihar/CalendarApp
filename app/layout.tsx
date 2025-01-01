import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Calendar App',
  description: 'Created by Debayan Pratihar',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}