'use client'

import { useState } from 'react'
import { History, Trash2, Clock, ChevronLeft, ChevronRight, LogOut, User, Code } from 'lucide-react'
import { useHistory, HistoryItem } from '../contexts/HistoryContext'
import { useAuth } from '../contexts/AuthContext'
import Image from 'next/image'

interface SidebarProps {
  activeSection: 'lab' | 'history'
  onSectionChange: (section: 'lab' | 'history') => void
  onHistoryItemSelect?: (item: HistoryItem) => void
  onAuthClick: () => void
}

const toneEmojis = {
  baby: '🧒',
  sarcastic: '💀',
  influencer: '💅',
  professor: '👨‍🏫'
}

const toneLabels = {
  baby: 'Baby Mode',
  sarcastic: 'Sarcastic Mode',
  influencer: 'Influencer Mode',
  professor: 'Professor Mode'
}

export default function Sidebar({ activeSection, onSectionChange, onHistoryItemSelect, onAuthClick }: SidebarProps) {
  const { history, clearHistory, deleteHistoryItem } = useHistory()
  const { user, signOut } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    return date.toLocaleDateString()
  }

  const truncateCode = (code: string, maxLength: number = 60) => {
    if (code.length <= maxLength) return code
    return code.substring(0, maxLength) + '...'
  }

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 ease-in-out bg-white dark:bg-[#0D1117] border-r border-gray-100 dark:border-gray-800 flex flex-col h-screen relative`}>
      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-2 top-6 z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-1 shadow-sm hover:shadow-md transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-750"
      >
        {isCollapsed ? (
          <ChevronRight className="w-3 h-3 text-gray-500 dark:text-gray-400" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-gray-500 dark:text-gray-400" />
        )}
      </button>

      {/* Header */}
      <div className="px-4 py-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden">
            <Image
              src="/logo.png"
              alt="Dumbify Logo"
              width={32}
              height={32}
              className="object-cover"
            />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-sm font-semibold text-gray-900 dark:text-white">Dumbify</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Code explanations</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="px-3 py-4">
        <nav className="space-y-1">
          <button
            onClick={() => onSectionChange('lab')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 text-sm ${
              activeSection === 'lab'
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Code className="w-4 h-4" />
            {!isCollapsed && <span>Lab</span>}
          </button>
          
          <button
            onClick={() => onSectionChange('history')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 text-sm ${
              activeSection === 'history'
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <History className="w-4 h-4" />
            {!isCollapsed && (
              <div className="flex items-center justify-between w-full">
                <span>History</span>
                {history.length > 0 && (
                  <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-1.5 py-0.5 rounded font-medium">
                    {history.length}
                  </span>
                )}
              </div>
            )}
          </button>
        </nav>
      </div>

      {/* History Section */}
      {activeSection === 'history' && !isCollapsed && (
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="px-3 pb-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-medium text-gray-900 dark:text-white uppercase tracking-wide">Recent</h3>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                  title="Clear all history"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto px-3 space-y-1">
            {history.length === 0 ? (
              <div className="text-center py-6">
                <Clock className="w-6 h-6 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-xs text-gray-500 dark:text-gray-400">No explanations yet</p>
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  className="group bg-gray-50 dark:bg-gray-800/50 rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                  onClick={() => onHistoryItemSelect?.(item)}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{toneEmojis[item.tone]}</span>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {toneLabels[item.tone].replace(' Mode', '')}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteHistoryItem(item.id)
                      }}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all duration-200"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  
                  <div className="bg-gray-800 dark:bg-gray-900 rounded p-1.5 mb-1">
                    <code className="text-xs text-green-400 font-mono leading-tight">
                      {truncateCode(item.code, 40)}
                    </code>
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimeAgo(item.timestamp)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Footer - Account Section (Pushed to Bottom) */}
      <div className="mt-auto px-3 py-4 border-t border-gray-100 dark:border-gray-800">
        {user ? (
          <div className="space-y-2">
            {/* User Info */}
            {!isCollapsed && (
              <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            )}
            
            {/* Sign Out Button */}
            <button
              onClick={() => signOut()}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200 transition-all duration-200 text-sm"
            >
              <LogOut className="w-4 h-4" />
              {!isCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        ) : (
          <button
            onClick={onAuthClick}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 text-sm font-medium"
          >
            <User className="w-4 h-4" />
            {!isCollapsed && <span>Sign In</span>}
          </button>
        )}
      </div>
    </div>
  )
} 