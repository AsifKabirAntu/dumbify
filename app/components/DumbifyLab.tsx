'use client'

import { useState, useEffect } from 'react'
import { Brain, Sparkles, Baby, Skull, User, GraduationCap, Zap } from 'lucide-react'
import { useHistory } from '../contexts/HistoryContext'
import { useAuth } from '../contexts/AuthContext'
import { saveExplanation, getLatestExplanation } from '../../lib/explanations'
import ExplanationDisplay from './ExplanationDisplay'

type ToneType = 'baby' | 'sarcastic' | 'influencer' | 'professor'

interface ToneOption {
  id: ToneType
  label: string
  icon: React.ReactNode
  description: string
  gradient: string
}

const toneOptions: ToneOption[] = [
  {
    id: 'baby',
    label: '🧒 Baby Mode',
    icon: <Baby className="w-5 h-5" />,
    description: 'Like you\'re 5 years old',
    gradient: 'from-pink-400 to-red-400'
  },
  {
    id: 'sarcastic',
    label: '💀 Sarcastic Mode',
    icon: <Skull className="w-5 h-5" />,
    description: 'With a healthy dose of snark',
    gradient: 'from-gray-600 to-gray-800'
  },
  {
    id: 'influencer',
    label: '💅 Influencer Mode',
    icon: <User className="w-5 h-5" />,
    description: 'Gen-Z vibes and energy',
    gradient: 'from-purple-400 to-pink-400'
  },
  {
    id: 'professor',
    label: '👨‍🏫 Professor Mode',
    icon: <GraduationCap className="w-5 h-5" />,
    description: 'Academic but accessible',
    gradient: 'from-blue-500 to-indigo-600'
  }
]

interface DumbifyLabProps {
  initialCode?: string
  initialTone?: ToneType
  initialExplanation?: string
}

export default function DumbifyLab({ initialCode = '', initialTone = 'baby', initialExplanation = '' }: DumbifyLabProps) {
  const [code, setCode] = useState(initialCode)
  const [selectedTone, setSelectedTone] = useState<ToneType>(initialTone)
  const [explanation, setExplanation] = useState(initialExplanation)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { addToHistory } = useHistory()
  const { user } = useAuth()

  // Update state when props change (for history selection)
  useEffect(() => {
    setCode(initialCode)
    setSelectedTone(initialTone)
    setExplanation(initialExplanation)
  }, [initialCode, initialTone, initialExplanation])

  // Load latest explanation when component mounts (only if no initial data provided)
  // Disabled auto-loading to start with clean state
  // useEffect(() => {
  //   const loadLatestExplanation = async () => {
  //     if (user && !initialCode && !initialExplanation) {
  //       const latest = await getLatestExplanation(user.id)
  //       if (latest) {
  //         setCode(latest.code)
  //         setSelectedTone(latest.tone)
  //         setExplanation(latest.explanation)
  //       }
  //     }
  //   }

  //   loadLatestExplanation()
  // }, [user, initialCode, initialExplanation])

  const handleDumbify = async () => {
    if (!code.trim()) {
      setError('Please enter some code to explain!')
      return
    }

    setIsLoading(true)
    setError('')
    setExplanation('')

    try {
      const response = await fetch('/api/dumbify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code.trim(),
          tone: selectedTone,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      setExplanation(data.explanation)
      
      // Add to history
      addToHistory({
        code: code.trim(),
        tone: selectedTone,
        explanation: data.explanation
      })

      // Save to Supabase if user is logged in
      if (user) {
        await saveExplanation({
          user_id: user.id,
          code: code.trim(),
          tone: selectedTone,
          explanation: data.explanation
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong!')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(explanation)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const downloadExplanation = () => {
    const blob = new Blob([explanation], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `explanation-${selectedTone}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const selectedToneOption = toneOptions.find(option => option.id === selectedTone)!

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-[#0D1117]">
      <div className="max-w-6xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Dumbify Lab
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            Transform complex code into clear explanations using Dumbify AI
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Input */}
          <div className="space-y-6">
            {/* Code Input */}
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Code
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCode('')}
                    className="text-xs text-gray-500 hover:text-red-500 transition-colors duration-200 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div className="relative">
                {/* Line Numbers */}
                <div className="absolute top-0 left-0 bottom-0 w-12 bg-gray-50 dark:bg-gray-800/50 border-r border-gray-200 dark:border-gray-700 select-none">
                  {code.split('\n').map((_, i) => (
                    <div
                      key={i}
                      className="text-xs text-gray-400 dark:text-gray-500 text-right pr-2 font-mono leading-6"
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
                {/* Code Editor */}
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="// Paste your JavaScript, Python, or any code here...
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}"
                  className="w-full h-64 pl-14 pr-4 py-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono text-sm leading-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 resize-none placeholder-gray-500 dark:placeholder-gray-400"
                  spellCheck="false"
                />
                {/* Status Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 px-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-4">
                    <span>{code.split('\n').length} lines</span>
                    <span>{code.length} characters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700">Plain Text</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tone Selector */}
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Style</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {toneOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedTone(option.id)}
                      className={`p-3 rounded-md border transition-all duration-200 text-left ${
                        selectedTone === option.id
                          ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded bg-gradient-to-r ${option.gradient} text-white`}>
                          {option.icon}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{option.label}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{option.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Dumbify Button */}
            <button
              onClick={handleDumbify}
              disabled={isLoading || !code.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md font-medium text-sm shadow-sm hover:shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Explain Code
                </>
              )}
            </button>
          </div>

          {/* Right Column - Output */}
          <div className="space-y-6">
            {/* Error Display */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 animate-fadeIn">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                  <span className="text-lg">⚠️</span>
                  <span className="font-medium">Error</span>
                </div>
                <p className="text-red-600 dark:text-red-300 mt-1 text-sm">{error}</p>
              </div>
            )}

            {/* Loading Shimmer */}
            {isLoading && (
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 animate-fadeIn">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg animate-pulse"></div>
                  <div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 mt-1 animate-pulse"></div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {/* Shimmer for main explanation */}
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5 animate-pulse"></div>
                  </div>
                  
                  {/* Shimmer for line-by-line breakdown */}
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3 animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-11/12 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-10/12 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-9/12 animate-pulse"></div>
                    </div>
                  </div>
                </div>
                
                {/* Action buttons shimmer */}
                <div className="flex items-center gap-2 mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-8 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-8 animate-pulse"></div>
                </div>
              </div>
            )}

            {/* Explanation Output */}
            {explanation && !isLoading && (
              <ExplanationDisplay
                explanation={explanation}
                code={code}
                tone={selectedTone}
                onCopy={copyToClipboard}
                onDownload={downloadExplanation}
              />
            )}

            {/* Placeholder when no explanation */}
            {!explanation && !error && !isLoading && (
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-8 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-blue-500 animate-pulse" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  ✨ Ready to Dumbify!
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Paste your code, pick a style, and watch the magic happen! 🚀
                </p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <span className="text-xs text-gray-400">Will include</span>
                  <span className="text-xs font-medium text-blue-500">overview + line-by-line</span>
                  <span className="text-xs text-gray-400">breakdown</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 