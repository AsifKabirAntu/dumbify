'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

export default function NavBar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
      <div className="flex items-center justify-end">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          ) : (
            <Sun className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          )}
        </button>
      </div>
    </div>
  )
} 