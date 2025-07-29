'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { getUserExplanations, SavedExplanation } from '../../lib/explanations'

export interface HistoryItem {
  id: string
  code: string
  tone: 'baby' | 'sarcastic' | 'influencer' | 'professor'
  explanation: string
  timestamp: Date
  language?: string
}

interface HistoryContextType {
  history: HistoryItem[]
  addToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void
  clearHistory: () => void
  deleteHistoryItem: (id: string) => void
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined)

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const { user } = useAuth()

  useEffect(() => {
    const loadHistory = async () => {
      if (user) {
        // Load history from Supabase for logged-in users
        const explanations = await getUserExplanations(user.id)
        const historyItems: HistoryItem[] = explanations.map((exp: SavedExplanation) => ({
          id: exp.id || '',
          code: exp.code,
          tone: exp.tone,
          explanation: exp.explanation,
          timestamp: new Date(exp.created_at || ''),
        }))
        setHistory(historyItems)
      } else {
        // Load history from localStorage for non-logged-in users
        const savedHistory = localStorage.getItem('dumbify-history')
        if (savedHistory) {
          try {
            const parsed = JSON.parse(savedHistory)
            // Convert timestamp strings back to Date objects
            const historyWithDates = parsed.map((item: any) => ({
              ...item,
              timestamp: new Date(item.timestamp)
            }))
            setHistory(historyWithDates)
          } catch (error) {
            console.error('Failed to parse history from localStorage:', error)
          }
        }
      }
    }

    loadHistory()
  }, [user])

  useEffect(() => {
    // Only save to localStorage for non-logged-in users
    if (!user) {
      localStorage.setItem('dumbify-history', JSON.stringify(history))
    }
  }, [history, user])

  const addToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    }
    
    setHistory(prev => [newItem, ...prev].slice(0, 50)) // Keep only last 50 items
  }

  const clearHistory = () => {
    setHistory([])
  }

  const deleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id))
  }

  return (
    <HistoryContext.Provider value={{ history, addToHistory, clearHistory, deleteHistoryItem }}>
      {children}
    </HistoryContext.Provider>
  )
}

export function useHistory() {
  const context = useContext(HistoryContext)
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider')
  }
  return context
} 