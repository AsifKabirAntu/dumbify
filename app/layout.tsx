import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from './contexts/ThemeContext'
import { HistoryProvider } from './contexts/HistoryContext'
import { AuthProvider } from './contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dumbify - Code Explanation Made Simple',
  description: 'Explain any code in a simplified, funny, or casual way using AI',
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