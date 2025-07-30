'use client'

import { useState, useEffect } from 'react'
import { useAuth } from './contexts/AuthContext'
import Sidebar from './components/Sidebar'
import DumbifyLab from './components/DumbifyLab'
import AuthModal from './components/AuthModal'
import NavBar from './components/NavBar'
import ShareCardsSection from './components/ShareCardsSection'
import type { HistoryItem } from './contexts/HistoryContext'
import { Sparkles, Zap, Brain, Heart, ArrowRight, Github, Star } from 'lucide-react'
import Image from 'next/image'

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

  // If not authenticated, show the modern welcome website
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        {/* Navigation */}
        <nav className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="Dumbify Logo"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Dumbify
              </span>
            </div>
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Sign In
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm">AI-Powered Code Explanations</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              Make Code
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Human-Friendly
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Transform complex code into simple explanations with personality. Choose your style: Baby talk, Sarcastic humor, Gen-Z vibes, or Academic depth.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold text-lg transition-all duration-200 shadow-2xl hover:shadow-purple-500/25 hover:scale-105 flex items-center space-x-2"
              >
                <span>Start Dumbifying</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2 text-gray-400">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">Free to use • No credit card required</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Choose Your <span className="text-purple-400">Explanation Style</span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Every developer learns differently. Pick the tone that resonates with you.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "🧒",
                title: "Baby Mode",
                description: "Explains like you're 5",
                example: "This code is like a magic box that sorts your toys!",
                gradient: "from-pink-500 to-rose-500"
              },
              {
                icon: "💀",
                title: "Sarcastic Mode", 
                description: "Developer humor",
                example: "Oh great, another for loop. How original...",
                gradient: "from-orange-500 to-red-500"
              },
              {
                icon: "💅",
                title: "Influencer Mode",
                description: "Gen-Z explanations",
                example: "This function is giving main character energy, no cap!",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: "👨‍🏫",
                title: "Professor Mode",
                description: "Academic breakdown",
                example: "This algorithm demonstrates optimal time complexity...",
                gradient: "from-blue-500 to-indigo-500"
              }
            ].map((mode, index) => (
              <div key={index} className="group">
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  <div className="text-4xl mb-4">{mode.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{mode.title}</h3>
                  <p className="text-gray-400 mb-4">{mode.description}</p>
                  <div className="bg-gray-800/50 rounded-lg p-3 text-sm text-gray-300 italic">
                    "{mode.example}"
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Why Developers <span className="text-blue-400">Love</span> Dumbify
              </h2>
              
              <div className="space-y-6">
                {[
                  {
                    icon: Zap,
                    title: "Instant Understanding",
                    description: "Get clear explanations in seconds, not hours of documentation reading."
                  },
                  {
                    icon: Brain,
                    title: "Learn While You Code",
                    description: "Build intuition about unfamiliar codebases and programming patterns."
                  },
                  {
                    icon: Heart,
                    title: "Personalized Learning",
                    description: "Choose the explanation style that matches your learning preference."
                  }
                ].map((benefit, index) => (
                  <div key={index} className="flex space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <benefit.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-gray-400">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-3xl p-8 backdrop-blur-lg border border-white/10">
                <div className="bg-gray-900/50 rounded-2xl p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="font-mono text-sm text-gray-300 space-y-2">
                    <div className="text-blue-400">function fibonacci(n) {"{"}
                    </div>
                    <div className="pl-4 text-purple-400">if (n &lt;= 1) return n;</div>
                    <div className="pl-4 text-green-400">return fibonacci(n-1) + fibonacci(n-2);</div>
                    <div className="text-blue-400">{"}"}</div>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                  <div className="text-sm text-purple-300 font-medium mb-2">🧒 Baby Mode Explanation:</div>
                  <div className="text-sm text-gray-300 italic">
                    "This is like a magic number machine that makes special numbers called Fibonacci! It's like counting bunny families! 🐰"
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Transform Your Code Understanding?
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              Join thousands of developers who've made code more human-friendly
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-bold text-xl transition-all duration-200 shadow-2xl hover:shadow-purple-500/25 hover:scale-105"
            >
              Get Started for Free
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="Dumbify Logo"
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
              <span className="font-semibold">Dumbify</span>
            </div>
            <div className="text-gray-400 text-sm">
              Made with ❤️ for developers who want simpler explanations
            </div>
          </div>
        </footer>

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