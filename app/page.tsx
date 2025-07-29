'use client'

import { useState, useEffect } from 'react'
import { useAuth } from './contexts/AuthContext'
import Sidebar from './components/Sidebar'
import DumbifyLab from './components/DumbifyLab'
import AuthModal from './components/AuthModal'
import NavBar from './components/NavBar'
import ShareCardsSection from './components/ShareCardsSection'
import type { HistoryItem } from './contexts/HistoryContext'

export default function Home() {
  const { user, loading } = useAuth()
  const [activeSection, setActiveSection] = useState<'lab' | 'history'>('lab')
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<HistoryItem | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showShareCards, setShowShareCards] = useState(false)

  // Listen for share cards event from ExplanationDisplay
  useEffect(() => {
    const handleOpenShareCards = () => {
      setShowShareCards(true)
    }

    window.addEventListener('openShareCards', handleOpenShareCards)
    return () => window.removeEventListener('openShareCards', handleOpenShareCards)
  }, [])

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-[#0D1117] items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, show only the authentication interface
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Welcome Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome to <span className="text-blue-600 dark:text-blue-400">Dumbify</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Explain any code in a simplified, funny, or casual way using AI
            </p>
          </div>

          {/* Feature Preview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              🎯 What you'll get:
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🧒</span>
                <span className="text-gray-700 dark:text-gray-300">Baby Mode - Explains like you're 5</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">💀</span>
                <span className="text-gray-700 dark:text-gray-300">Sarcastic Mode - Funny developer humor</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">💅</span>
                <span className="text-gray-700 dark:text-gray-300">Influencer Mode - Gen-Z explanations</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">👨‍🏫</span>
                <span className="text-gray-700 dark:text-gray-300">Professor Mode - Academic breakdown</span>
              </div>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg"
          >
            Sign In to Start Dumbifying
          </button>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
            New to Dumbify? You can sign up when you click above!
          </p>
        </div>

        {/* Auth Modal */}
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)} 
        />
      </div>
    )
  }

      // If authenticated, show the main app interface
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-[#0D1117] overflow-hidden">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={(section) => {
            setActiveSection(section)
            if (section === 'lab') {
              setSelectedHistoryItem(null)
            }
          }}
          onHistoryItemSelect={(item: HistoryItem) => {
            setSelectedHistoryItem(item)
            setActiveSection('history')
          }}
          onAuthClick={() => setShowAuthModal(true)}
        />
        
        {showShareCards ? (
          <main className="flex-1 overflow-y-auto">
            <ShareCardsSection onBack={() => setShowShareCards(false)} />
          </main>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            <NavBar />
            <main className="flex-1 overflow-y-auto">
              <DumbifyLab 
                initialCode={selectedHistoryItem?.code || ''}
                initialTone={selectedHistoryItem?.tone || 'baby'}
                initialExplanation={selectedHistoryItem?.explanation || ''}
              />
            </main>
          </div>
        )}

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  )
} 