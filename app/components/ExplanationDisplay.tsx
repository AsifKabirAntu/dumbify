'use client'

import { useState } from 'react'
import { Copy, Download, Eye, EyeOff, BarChart3 } from 'lucide-react'


interface ExplanationDisplayProps {
  explanation: string
  code: string
  tone: 'baby' | 'sarcastic' | 'influencer' | 'professor'
  onCopy: () => void
  onDownload: () => void
}

export default function ExplanationDisplay({ 
  explanation, 
  code, 
  tone, 
  onCopy, 
  onDownload 
}: ExplanationDisplayProps) {
  const [showLineByLine, setShowLineByLine] = useState(false)

  // Parse the explanation to extract overview and line-by-line sections
  const parseExplanation = (text: string) => {
    const sections = text.split('##').filter(section => section.trim())
    
    let overview = ''
    let lineByLine = ''
    
    for (const section of sections) {
      const trimmed = section.trim()
      if (trimmed.toLowerCase().includes('overview') || trimmed.toLowerCase().includes('summary')) {
        overview = trimmed.replace(/^(overview|summary):?\s*/i, '').trim()
      } else if (trimmed.toLowerCase().includes('line') || trimmed.toLowerCase().includes('breakdown')) {
        lineByLine = trimmed.replace(/^.*?:\s*/i, '').trim()
      }
    }
    
    // If no clear sections found, use the first part as overview
    if (!overview && !lineByLine) {
      const parts = text.split('\n\n')
      overview = parts[0] || text
      lineByLine = parts.slice(1).join('\n\n')
    }
    
    return { overview: overview || text, lineByLine }
  }

  // Format line-by-line text to improve readability
  const formatLineByLine = (text: string) => {
    return text
      .split('\n')
      .map(line => {
        // If line contains code snippets (backticks), format them better
        if (line.includes('`')) {
          return line.replace(/`([^`]+)`/g, (match, code) => {
            // If code is too long, truncate it intelligently
            if (code.length > 50) {
              const start = code.substring(0, 30)
              const end = code.substring(code.length - 15)
              return `\`${start}...${end}\``
            }
            return match
          })
        }
        return line
      })
      .join('\n')
  }

  const { overview, lineByLine } = parseExplanation(explanation)
  const wordCount = explanation.split(/\s+/).length
  const readingTime = Math.ceil(wordCount / 200) // Average reading speed

  const toneGradients = {
    baby: 'from-pink-100 to-blue-100 dark:from-pink-900/20 dark:to-blue-900/20',
    sarcastic: 'from-red-100 to-orange-100 dark:from-red-900/20 dark:to-orange-900/20',
    influencer: 'from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20',
    professor: 'from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20'
  }

  const toneEmojis = {
    baby: '🧒',
    sarcastic: '💀',
    influencer: '💅',
    professor: '👨‍🏫'
  }

  return (
    <div className="space-y-6">
      {/* Main Explanation */}
      <div className={`bg-gradient-to-br ${toneGradients[tone]} rounded-xl border border-gray-200 dark:border-gray-700 p-6`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{toneEmojis[tone]}</span>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Code Explanation
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                {tone} mode
              </p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
                            <button
                  onClick={() => {
                    // Save data to localStorage for the share functionality
                    localStorage.setItem('shareCode', code)
                    localStorage.setItem('shareExplanation', explanation)
                    localStorage.setItem('shareTone', tone)
                    // Trigger a custom event to notify the navbar
                    window.dispatchEvent(new CustomEvent('openShareCards'))
                  }}
                  className="px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all text-sm font-medium flex items-center gap-2"
                >
                  📸 Share Cards
                </button>
            <button
              onClick={onCopy}
              className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
              title="Copy explanation"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={onDownload}
              className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
              title="Download as text"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Overview */}
        <div className="prose prose-sm max-w-none text-gray-800 dark:text-gray-200 mb-4">
          <div className="whitespace-pre-wrap leading-relaxed">
            {overview}
          </div>
        </div>

        {/* Line-by-line toggle */}
        {lineByLine && (
          <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
            <button
              onClick={() => setShowLineByLine(!showLineByLine)}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {showLineByLine ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showLineByLine ? 'Hide' : 'Show'} Line-by-Line Breakdown
            </button>

            {showLineByLine && (
              <div className="mt-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                <div className="p-4 max-h-96 overflow-y-auto">
                  <div className="space-y-3 text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                    {formatLineByLine(lineByLine).split('\n').map((line, index) => {
                      if (!line.trim()) return null
                      
                      // Check if this line starts with a bullet point or dash
                      const isBulletPoint = line.trim().startsWith('-') || line.trim().startsWith('•')
                      
                      return (
                        <div key={index} className={`${isBulletPoint ? 'pl-4' : ''} break-words`}>
                          {isBulletPoint ? (
                            <div className="flex gap-2">
                              <span className="text-gray-400 dark:text-gray-500 mt-1">•</span>
                              <span className="flex-1">{line.replace(/^[-•]\s*/, '')}</span>
                            </div>
                          ) : (
                            <span>{line}</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Fun Stats */}
        <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mt-4">
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <BarChart3 className="w-3 h-3" />
              <span>{wordCount} words</span>
            </div>
            <div>📚 {readingTime} min read</div>
            <div>🎯 {tone} tone</div>
          </div>
        </div>
      </div>


    </div>
  )
} 