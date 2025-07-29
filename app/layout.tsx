import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from './contexts/ThemeContext'
import { HistoryProvider } from './contexts/HistoryContext'
import { AuthProvider } from './contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dumbify - AI Code Explanations Made Simple',
  description: 'Transform complex code into simple, fun, and easy-to-understand explanations using AI. Choose from Baby, Sarcastic, Influencer, or Professor modes!',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} overflow-hidden`} suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <HistoryProvider>
              {children}
            </HistoryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
} 