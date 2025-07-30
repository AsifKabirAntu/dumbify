'use client'

import { useEffect, useState, useRef } from 'react'
import { ArrowLeft, ChevronLeft, ChevronRight, Download, Twitter, Linkedin } from 'lucide-react'
import html2canvas from 'html2canvas'

interface ShareData {
  code: string
  explanation: string
  tone: 'baby' | 'sarcastic' | 'influencer' | 'professor'
  overview: string
  lineByLine: string[]
}

const cardTemplates = [
  { id: 'modern', name: 'Modern Gradient', emoji: '🌈' },
  { id: 'developer', name: 'Developer Dark', emoji: '💻' },
  { id: 'minimal', name: 'Minimal White', emoji: '✨' },
  { id: 'retro', name: 'Retro Neon', emoji: '🎨' },
  { id: 'professional', name: 'Professional', emoji: '💼' },
]

const toneEmojis = {
  baby: '🧒',
  sarcastic: '💀',
  influencer: '💅',
  professor: '👨‍🏫'
}

// Helper functions for dynamic content sizing and positioning
function getDynamicCodeFontSize(content: string): string {
  const length = content.length
  if (length < 200) return 'text-base' // 16px
  if (length < 400) return 'text-sm'   // 14px
  if (length < 600) return 'text-xs'   // 12px
  return 'text-xs'                     // 12px for very long content
}

function getDynamicTextFontSize(content: string): string {
  const length = content.length
  if (length < 100) return 'text-xl'   // 20px
  if (length < 200) return 'text-lg'   // 18px
  if (length < 300) return 'text-base' // 16px
  return 'text-sm'                     // 14px
}

function getDynamicLineHeight(content: string): string {
  const length = content.length
  if (length < 200) return 'leading-relaxed'
  if (length < 400) return 'leading-normal'
  return 'leading-snug'
}

// Helper functions (copied from share page)
function smartTruncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  
  const truncated = text.slice(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  const lastPeriod = truncated.lastIndexOf('.')
  const lastComma = truncated.lastIndexOf(',')
  
  const cutPoint = lastPeriod > maxLength - 50 ? lastPeriod + 1 :
                   lastComma > maxLength - 30 ? lastComma + 1 :
                   lastSpace > maxLength - 20 ? lastSpace : maxLength
  
  return text.slice(0, cutPoint).trim() + (cutPoint < text.length ? '...' : '')
}

function smartCodeTruncate(code: string, maxLength: number): string {
  if (code.length <= maxLength) return code
  
  const lines = code.split('\n')
  let result = ''
  
  for (const line of lines) {
    if (result.length + line.length > maxLength) {
      const remaining = maxLength - result.length - 3
      if (remaining > 20) {
        result += line.slice(0, remaining).trim() + '...'
      } else {
        result = result.trim() + '...'
      }
      break
    }
    result += line + '\n'
  }
  
  return result.trim()
}

interface ShareCardsSectionProps {
  onBack: () => void
}

export default function ShareCardsSection({ onBack }: ShareCardsSectionProps) {
  const [shareData, setShareData] = useState<ShareData | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleGenerateSocialMediaContent = async () => {
    const code = localStorage.getItem('shareCode')
    const explanation = localStorage.getItem('shareExplanation')
    const tone = localStorage.getItem('shareTone')

    if (!code || !tone) return

    setIsGenerating(true)
    try {
      const response = await fetch('/api/socialMedia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, tone }),
      })

      const data = await response.json()

      if (data.socialMediaContent) {
        const parsedContent = parseStructuredSocialMediaContent(data.socialMediaContent, tone as any)
        setShareData({
          code: code,
          explanation: explanation || '',
          tone: tone as any,
          overview: parsedContent.overview,
          lineByLine: parsedContent.breakdowns,
        })
      }
    } catch (error) {
      console.error('Error generating social media content:', error)
      // Fallback to original explanation if API fails
      if (explanation) {
        const fallbackContent = parseAndOptimizeContent(explanation, tone as any)
        setShareData({
          code,
          explanation,
          tone: tone as any,
          overview: fallbackContent.overview,
          lineByLine: fallbackContent.lineByLine.slice(0, 5),
        })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // New function to parse structured social media content
  const parseStructuredSocialMediaContent = (content: string, tone: string) => {
    const sections = content.split('##').filter(s => s.trim())
    let codeOverview = ''
    let overview = ''
    const breakdowns: string[] = []

    sections.forEach(section => {
      const trimmed = section.trim()
      if (trimmed.startsWith('CODE_OVERVIEW')) {
        codeOverview = trimmed.replace('CODE_OVERVIEW', '').trim()
      } else if (trimmed.startsWith('QUICK_SUMMARY')) {
        overview = trimmed.replace('QUICK_SUMMARY', '').trim()
      } else if (trimmed.startsWith('BREAKDOWN_')) {
        const breakdownContent = trimmed.replace(/BREAKDOWN_\d+/, '').trim()
        if (breakdownContent) {
          breakdowns.push(breakdownContent)
        }
      }
    })

    // Use code overview as the main overview if no quick summary
    if (!overview && codeOverview) {
      overview = codeOverview
    }

    // Ensure we have at least some content
    if (!overview) {
      overview = `Check out this ${tone} explanation of some code! 🚀`
    }

    return {
      overview,
      breakdowns: breakdowns.slice(0, 5) // Limit to 5 breakdown cards
    }
  }

  useEffect(() => {
    handleGenerateSocialMediaContent()
  }, [])

  // Enhanced content parsing and optimization function
  const parseAndOptimizeContent = (explanation: string, tone: string) => {
    // Step 1: Better section detection
    const sections = explanation.split('##').filter(s => s.trim())
    let overview = ''
    let lineByLineText = ''
    
    sections.forEach(section => {
      const trimmed = section.trim()
      const lowerSection = trimmed.toLowerCase()
      
      if (lowerSection.includes('overview') || lowerSection.includes('summary') || sections.indexOf(section) === 0) {
        overview = trimmed.replace(/^(overview|summary)[:\-\s]*/gi, '').trim()
      } else if (lowerSection.includes('line') || lowerSection.includes('breakdown') || lowerSection.includes('explanation')) {
        lineByLineText = trimmed.replace(/^(line.*breakdown|breakdown|explanation)[:\-\s]*/gi, '').trim()
      }
    })
    
    // Step 2: Fallback parsing if no clear sections
    if (!overview && !lineByLineText) {
      const sentences = explanation.split(/[.!?]+/).filter(s => s.trim().length > 20)
      overview = sentences.slice(0, 2).join('. ').trim() + '.'
      lineByLineText = sentences.slice(2).join('. ').trim()
    }
    
    // Step 3: Optimize overview for social media
    overview = optimizeForSocialMedia(overview, tone, 'overview')
    
    // Step 4: Create engaging line-by-line cards
    const lineByLine = createEngagingCards(lineByLineText, tone)
    
    return { overview, lineByLine }
  }

  // Optimize content for social media engagement
  const optimizeForSocialMedia = (content: string, tone: string, type: 'overview' | 'line') => {
    const hooks = {
      baby: {
        overview: "🧒 Ever wondered what this code does? Let me explain it like you're 5! ",
        line: "🔍 Here's what each part does: "
      },
      sarcastic: {
        overview: "💀 This code looks complicated, but it's actually... ",
        line: "🎯 Let's break down this masterpiece: "
      },
      influencer: {
        overview: "💅 OMG, this code is giving me LIFE! Here's the tea: ",
        line: "✨ The breakdown you've been waiting for: "
      },
      professor: {
        overview: "👨‍🏫 Let's analyze this code systematically: ",
        line: "📚 Detailed breakdown follows: "
      }
    }
    
    const hook = hooks[tone as keyof typeof hooks]?.[type] || ""
    
    // Clean up content and add hook (no truncation)
    let cleaned = content.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim()
    
    return hook + cleaned
  }

  // Create engaging line-by-line cards
  const createEngagingCards = (lineByLineText: string, tone: string) => {
    if (!lineByLineText) return []
    
    // Split by bullet points or dashes first
    let items = lineByLineText.split(/\n\s*[-•]\s*/).filter(item => item.trim().length > 30)
    
    // If no bullet points, split by sentences
    if (items.length <= 1) {
      const sentences = lineByLineText.split(/[.!?]+/).filter(s => s.trim().length > 20)
      items = sentences.map(s => s.trim() + '.')
    }
    
    // Create engaging cards with hooks
    const cards = items.map((item, index) => {
      const hooks = {
        baby: ["🧒 This part is like...", "🎈 And then we have...", "🎪 Here's the fun part...", "🎨 Look at this...", "🎯 This does something cool...", "🌟 And finally..."],
        sarcastic: ["💀 Of course, this line...", "🎭 And here we go...", "🎪 This is where it gets interesting...", "🎯 Because why not...", "🌟 And the grand finale...", "🎨 The cherry on top..."],
        influencer: ["💅 This part is literally...", "✨ And then it's giving...", "🔥 This is where the magic happens...", "💫 It's doing this thing...", "🌟 And it's serving...", "💎 The finale is..."],
        professor: ["📚 This component serves to...", "🔬 The function implements...", "📖 This section establishes...", "🎓 The mechanism operates by...", "🔍 This element facilitates...", "📝 Finally, this ensures..."]
      }
      
      const hook = hooks[tone as keyof typeof hooks]?.[index % 6] || "🔍 This part: "
      
      // Clean and optimize the content (no truncation)
      let content = item.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim()
      
      return hook + content
    })
    
    return cards.filter(card => card.length > 30) // Only filter out very short cards
  }

  const allCards = shareData ? [
    { type: 'code', content: shareData.code, title: 'The Code' },
    { type: 'overview', content: shareData.overview, title: 'Quick Overview' },
    ...shareData.lineByLine.map((line, index) => ({
      type: 'line',
      content: line,
      title: `Breakdown ${index + 1}`
    }))
  ] : []

  // Style picker view
  if (!shareData || !selectedTemplate) {
    return (
      <div className="p-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <button
            onClick={onBack}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            Dumbify Lab
          </button>
          <span className="text-gray-400 dark:text-gray-600">/</span>
          <span className="text-gray-900 dark:text-white font-medium">Create Shareable Cards</span>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              📸 Create Shareable Cards
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {isGenerating ? 'Generating AI-powered social media content...' : 'Choose your style, then browse through all your cards'}
            </p>
          </div>
        </div>

        {isGenerating && (
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-8 mb-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-gray-600 dark:text-gray-400">Generating social media content...</span>
            </div>
          </div>
        )}

        {shareData && !isGenerating && (
          <>
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{toneEmojis[shareData.tone]}</span>
                <span className="font-medium text-gray-900 dark:text-white capitalize">
                  {shareData.tone} Mode
                </span>
                <span className="text-gray-500 dark:text-gray-400">•</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {allCards.length} cards will be generated
                </span>
              </div>
              <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-x-auto">
                <code>{shareData.code.slice(0, 200)}...</code>
              </pre>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                🎨 Choose Your Style
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {cardTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className="p-4 border-2 border-transparent hover:border-blue-500 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all text-center"
                  >
                    <div className="text-2xl mb-2">{template.emoji}</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {template.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  // Card navigation view
  const currentCard = allCards[currentCardIndex]
  const templateName = cardTemplates.find(t => t.id === selectedTemplate)?.name || 'Modern'

  return (
    <div className="p-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 mb-6 text-sm">
        <button
          onClick={onBack}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          Dumbify Lab
        </button>
        <span className="text-gray-400 dark:text-gray-600">/</span>
        <button
          onClick={() => setSelectedTemplate(null)}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          Create Shareable Cards
        </button>
        <span className="text-gray-400 dark:text-gray-600">/</span>
        <span className="text-gray-900 dark:text-white font-medium">{templateName} Cards</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedTemplate(null)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {templateName} Cards
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Card {currentCardIndex + 1} of {allCards.length} • {currentCard?.title}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-8 mb-6">
        <div ref={cardRef} className="flex justify-center">
          {selectedTemplate === 'modern' && <ModernCard card={currentCard} shareData={shareData} />}
          {selectedTemplate === 'developer' && <DeveloperCard card={currentCard} shareData={shareData} />}
          {selectedTemplate === 'minimal' && <MinimalCard card={currentCard} shareData={shareData} />}
          {selectedTemplate === 'retro' && <RetroCard card={currentCard} shareData={shareData} />}
          {selectedTemplate === 'professional' && <ProfessionalCard card={currentCard} shareData={shareData} />}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentCardIndex(Math.max(0, currentCardIndex - 1))}
          disabled={currentCardIndex === 0}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        
        <div className="flex gap-2">
          {allCards.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentCardIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentCardIndex 
                  ? 'bg-blue-600' 
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
        
        <button
          onClick={() => setCurrentCardIndex(Math.min(allCards.length - 1, currentCardIndex + 1))}
          disabled={currentCardIndex === allCards.length - 1}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <button
          onClick={async () => {
            if (!cardRef.current) return
            setIsGenerating(true)
            try {
              const canvas = await html2canvas(cardRef.current, {
                useCORS: true,
                width: 700,
                height: 700,
                background: 'transparent',
              } as any)
              const link = document.createElement('a')
              link.download = `dumbify-card-${currentCardIndex + 1}.png`
              link.href = canvas.toDataURL()
              link.click()
            } finally {
              setIsGenerating(false)
            }
          }}
          disabled={isGenerating}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {isGenerating ? 'Generating...' : 'Download PNG'}
        </button>
        <button
          onClick={() => {
            const text = `Just used @Dumbify to break down my code! ${toneEmojis[shareData?.tone || 'baby']} Try it FREE!`
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.origin)}`)
          }}
          className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
        >
          <Twitter className="w-4 h-4" />
          Share on Twitter
        </button>
      </div>
    </div>
  )
}

// Card Components (same as in share page but with improved heights and content)
function ModernCard({ card, shareData }: { card: any, shareData: ShareData }) {
  const isCodeCard = card.type === 'code'
  const isOverviewCard = card.type === 'overview'
  
  // Don't truncate code, use dynamic sizing instead
  const displayContent = card.content
  const codeFontSize = getDynamicCodeFontSize(displayContent)
  const textFontSize = getDynamicTextFontSize(displayContent)
  const lineHeight = getDynamicLineHeight(displayContent)
  
  return (
    <div className="w-[700px] h-[700px] bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 p-10 text-white rounded-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{toneEmojis[shareData.tone]}</span>
            <span className="font-bold text-lg capitalize">{shareData.tone}</span>
          </div>
          <div className="text-right">
            <div className="font-bold text-lg">Dumbify</div>
            <div className="text-sm opacity-80 font-medium">dumbify.dev</div>
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
            {isCodeCard && '💻'} 
            {isOverviewCard && '🧠'} 
            {card.type === 'line' && '🔍'} 
            {card.title}
          </h3>
        </div>
        
        <div className="flex-1 flex flex-col justify-center min-h-0">
          {isCodeCard ? (
            <div className="bg-black/30 rounded-lg p-6 border border-white/20 flex-1 flex items-center justify-center">
              <pre className={`${codeFontSize} ${lineHeight} font-mono whitespace-pre-wrap text-left max-h-full w-full`}>
                {displayContent}
              </pre>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur rounded-lg p-6 flex-1 flex items-center justify-center">
              <p className={`${textFontSize} ${lineHeight} font-medium text-center max-h-full`}>
                {displayContent}
              </p>
            </div>
          )}
        </div>
        
        <div className="text-center mt-4">
          <div className="font-bold text-xl">Try Dumbify FREE! 🚀</div>
          <div className="text-base opacity-80 font-medium">#CodeExplained #Developer #AI</div>
        </div>
      </div>
    </div>
  )
}

// Other card components
function DeveloperCard({ card, shareData }: { card: any, shareData: ShareData }) {
  const isCodeCard = card.type === 'code'
  const isOverviewCard = card.type === 'overview'
  
  const displayContent = card.content
  const codeFontSize = getDynamicCodeFontSize(displayContent)
  const textFontSize = getDynamicTextFontSize(displayContent)
  const lineHeight = getDynamicLineHeight(displayContent)
  
  return (
    <div className="w-[700px] h-[700px] bg-gray-900 p-10 text-green-400 rounded-xl font-mono border border-green-500/30">
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-4 text-green-300">
          <div className="flex items-center gap-2 text-base font-medium">
            <span>~/dumbify</span>
            <span className="text-yellow-400">$</span>
            <span className="text-white">{toneEmojis[shareData.tone]} {shareData.tone}</span>
          </div>
          <div className="text-sm font-medium">
            <div>/** Dumbify **/</div>
            <div>dumbify.dev</div>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="text-purple-400 text-sm mb-2 font-medium">
            // {isCodeCard && '💻'} {isOverviewCard && '🧠'} {card.type === 'line' && '🔍'} {card.title}
          </div>
        </div>
        
        <div className="flex-1 flex flex-col justify-center min-h-0">
          {isCodeCard ? (
            <div className="bg-black/50 rounded p-6 border border-green-500/20 flex-1 flex flex-col justify-center">
              <div className="text-cyan-400 text-sm mb-2 font-semibold">&gt; cat code.js</div>
              <div className="flex-1 flex items-center justify-center">
                <pre className={`${codeFontSize} ${lineHeight} text-gray-300 whitespace-pre-wrap text-left max-h-full w-full`}>
                  {displayContent}
                </pre>
              </div>
            </div>
          ) : (
            <div className="border border-green-500/30 rounded p-6 bg-black/30 flex-1 flex flex-col justify-center">
              <div className="text-cyan-400 text-sm mb-2 font-semibold">
                &gt; {isOverviewCard ? 'dumbify --overview' : 'dumbify --explain-line'}
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className={`${textFontSize} ${lineHeight} text-gray-300 font-medium text-center max-h-full`}>
                  "{displayContent}"
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="text-center mt-4 text-green-400">
          <div className="font-bold text-xl">&gt; Try Dumbify FREE! 🚀</div>
          <div className="text-base text-gray-500 font-medium">#CodeMadeEasy #DevTools</div>
        </div>
      </div>
    </div>
  )
}

function MinimalCard({ card, shareData }: { card: any, shareData: ShareData }) {
  const isCodeCard = card.type === 'code'
  const isOverviewCard = card.type === 'overview'
  
  const displayContent = card.content
  const codeFontSize = getDynamicCodeFontSize(displayContent)
  const textFontSize = getDynamicTextFontSize(displayContent)
  const lineHeight = getDynamicLineHeight(displayContent)
  
  return (
    <div className="w-[700px] h-[700px] bg-white p-10 text-gray-900 rounded-xl shadow-lg border">
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{toneEmojis[shareData.tone]}</span>
            <div>
              <div className="font-bold text-lg capitalize">{shareData.tone} Mode</div>
              <div className="text-sm text-gray-500 flex items-center gap-1 font-medium">
                {isCodeCard && '💻'} {isOverviewCard && '🧠'} {card.type === 'line' && '🔍'} {card.title}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-xl text-gray-900">Dumbify</div>
            <div className="text-sm text-gray-500 font-medium">dumbify.dev</div>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col justify-center min-h-0">
          {isCodeCard ? (
            <div className="bg-gray-100 rounded-lg p-6 text-gray-700 flex-1 flex flex-col justify-center">
              <div className="text-blue-600 text-base mb-2 font-sans font-semibold">📝 Code Input</div>
              <div className="flex-1 flex items-center justify-center">
                <pre className={`${codeFontSize} ${lineHeight} font-mono whitespace-pre-wrap text-left max-h-full w-full`}>
                  {displayContent}
                </pre>
              </div>
            </div>
          ) : (
            <div className="border-l-4 border-blue-500 pl-4 flex-1 flex flex-col justify-center">
              <div className="text-blue-600 text-base mb-2 font-semibold">
                {isOverviewCard ? '🧠 Overview' : '🔍 Detailed Analysis'}
              </div>
              <div className="flex-1 flex items-center justify-center">
                <p className={`${textFontSize} ${lineHeight} text-gray-800 font-medium text-center max-h-full`}>
                  {displayContent}
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="text-center mt-4 pt-4 border-t border-gray-200">
          <div className="font-bold text-xl text-blue-600">Try Dumbify FREE! 🚀</div>
          <div className="text-base text-gray-500 mt-1 font-medium">#CodeSimplified #Learning</div>
        </div>
      </div>
    </div>
  )
}

function RetroCard({ card, shareData }: { card: any, shareData: ShareData }) {
  const isCodeCard = card.type === 'code'
  const isOverviewCard = card.type === 'overview'
  
  const displayContent = card.content
  const codeFontSize = getDynamicCodeFontSize(displayContent)
  const textFontSize = getDynamicTextFontSize(displayContent)
  const lineHeight = getDynamicLineHeight(displayContent)
  
  return (
    <div className="w-[700px] h-[700px] bg-black p-10 text-cyan-400 rounded-xl relative overflow-hidden" style={{
      background: 'linear-gradient(45deg, #ff006e, #8338ec, #3a86ff)',
      filter: 'contrast(1.1) saturate(1.2)'
    }}>
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10 h-full flex flex-col text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-3xl animate-pulse">{toneEmojis[shareData.tone]}</span>
            <div className="font-bold text-xl uppercase tracking-wider">
              {shareData.tone}
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-2xl uppercase tracking-wider">
              DUMBIFY
            </div>
            <div className="text-sm opacity-80 font-medium">dumbify.dev</div>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="text-yellow-300 text-sm mb-2 uppercase tracking-wide flex items-center gap-2 font-semibold">
            {isCodeCard && '💻'} {isOverviewCard && '🧠'} {card.type === 'line' && '🔍'} {card.title}
          </div>
        </div>
        
        <div className="flex-1 flex flex-col justify-center min-h-0">
          {isCodeCard ? (
            <div className="bg-black/50 rounded border border-cyan-400/50 p-6 font-mono flex-1 flex flex-col justify-center">
              <div className="text-pink-400 text-sm mb-2 uppercase font-semibold">&gt; LOAD_CODE</div>
              <div className="flex-1 flex items-center justify-center">
                <pre className={`${codeFontSize} ${lineHeight} whitespace-pre-wrap text-cyan-300 text-left max-h-full w-full`}>
                  {displayContent}
                </pre>
              </div>
            </div>
          ) : (
            <div className="border border-magenta-400/50 rounded-lg p-6 bg-black/30 flex-1 flex flex-col justify-center">
              <div className="text-yellow-300 text-sm mb-2 uppercase font-semibold">
                &gt; {isOverviewCard ? 'SCAN_OVERVIEW' : 'ANALYZE_LINE'}
              </div>
              <div className="flex-1 flex items-center justify-center">
                <p className={`${textFontSize} ${lineHeight} font-medium text-center max-h-full`}>
                  {displayContent}
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="text-center mt-4">
          <div className="font-bold text-xl uppercase tracking-wider">
            GET DUMBIFIED! 🚀
          </div>
          <div className="text-sm opacity-80 mt-1 font-medium">#RetroCode #80sVibes</div>
        </div>
      </div>
    </div>
  )
}

function ProfessionalCard({ card, shareData }: { card: any, shareData: ShareData }) {
  const isCodeCard = card.type === 'code'
  const isOverviewCard = card.type === 'overview'
  
  const displayContent = card.content
  const codeFontSize = getDynamicCodeFontSize(displayContent)
  const textFontSize = getDynamicTextFontSize(displayContent)
  const lineHeight = getDynamicLineHeight(displayContent)
  
  return (
    <div className="w-[700px] h-[700px] bg-gradient-to-b from-blue-600 to-blue-800 p-10 text-white rounded-xl">
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl">
              {toneEmojis[shareData.tone]}
            </div>
            <div>
              <div className="font-bold text-lg capitalize">{shareData.tone} Analysis</div>
              <div className="text-sm opacity-80 flex items-center gap-1 font-medium">
                {isCodeCard && '💻'} {isOverviewCard && '🧠'} {card.type === 'line' && '🔍'} {card.title}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-2xl">Dumbify</div>
            <div className="text-sm opacity-60 font-medium">Try Dumbify FREE! 🚀</div>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col justify-center min-h-0">
          {isCodeCard ? (
            <div className="bg-white/10 rounded-lg p-6 flex-1 flex flex-col justify-center">
              <div className="text-blue-200 text-sm mb-2 uppercase tracking-wide flex items-center gap-2 font-semibold">
                📝 Code Sample
              </div>
              <div className="flex-1 flex items-center justify-center">
                <pre className={`${codeFontSize} ${lineHeight} font-mono text-gray-200 whitespace-pre-wrap text-left max-h-full w-full`}>
                  {displayContent}
                </pre>
              </div>
            </div>
          ) : (
            <div className="bg-white/10 rounded-lg p-6 flex-1 flex flex-col justify-center">
              <div className="text-blue-200 text-sm mb-2 uppercase tracking-wide flex items-center gap-2 font-semibold">
                {isOverviewCard ? '🧠 Executive Summary' : '🔍 Technical Analysis'}
              </div>
              <div className="flex-1 flex items-center justify-center">
                <p className={`${textFontSize} ${lineHeight} font-medium text-center max-h-full`}>
                  {displayContent}
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="text-center mt-4 pt-4 border-t border-white/20">
          <div className="text-base text-white/80 font-medium">#CodeExplained #Professional #AI</div>
        </div>
      </div>
    </div>
  )
} 