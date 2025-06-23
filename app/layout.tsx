import { type Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'PDF Merger - Combine PDF Files Online',
  description: 'Merge multiple PDF files into one document easily with our free online PDF merger tool. No registration required.',
  keywords: 'PDF merger, combine PDF, merge PDF files, PDF tools, online PDF merger',
  authors: [{ name: 'PDF Merger' }],
  creator: 'PDF Merger',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://pdfmerger.app',
    title: 'PDF Merger - Combine PDF Files Online',
    description: 'Merge multiple PDF files into one document easily with our free online PDF merger tool.',
    siteName: 'PDF Merger',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}