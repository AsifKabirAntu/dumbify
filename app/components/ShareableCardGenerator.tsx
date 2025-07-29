'use client'

import { useState, useRef } from 'react'
import { Download, Share2, Twitter, Linkedin, ChevronLeft, ChevronRight, Copy } from 'lucide-react'
import html2canvas from 'html2canvas'

interface ShareableCardGeneratorProps {
  code: string
  explanation: string
  tone: 'baby' | 'sarcastic' | 'influencer' | 'professor'
  overview: string
  lineByLine: string
}

interface CardTemplate {
  id: string
  name: string
  description: string
}

const cardTemplates: CardTemplate[] = [
  { id: 'modern', name: 'Modern Gradient', description: 'Clean gradient design' },
  { id: 'developer', name: 'Developer Dark', description: 'Dark theme for developers' },
  { id: 'minimal', name: 'Minimal White', description: 'Clean minimal design' },
  { id: 'retro', name: 'Retro Neon', description: 'Vibrant neon colors' },
  { id: 'professional', name: 'Professional', description: 'LinkedIn-ready design' }
]

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

export default function ShareableCardGenerator({ 
  code, 
  explanation, 
  tone, 
  overview, 
  lineByLine 
}: ShareableCardGeneratorProps) {
  const [activeTemplate, setActiveTemplate] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const generateImage = async () => {
    if (!cardRef.current) return
    
    setIsGenerating(true)
    try {
      const canvas = await html2canvas(cardRef.current, {
        useCORS: true
      })
      
      const link = document.createElement('a')
      link.download = `dumbify-${tone}-explanation.png`
      link.href = canvas.toDataURL()
      link.click()
    } catch (error) {
      console.error('Error generating image:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const shareToTwitter = () => {
    const viralTexts = {
      baby: `Just explained code like I'm 5 and my mind is BLOWN 🤯🧒

AI turned my spaghetti code into baby language and I actually understand it now!

Try @Dumbify FREE → dumbify.dev

#DumbifyThis #CodeExplained #WebDev #AI #Developer`,
      
      sarcastic: `AI just roasted my code harder than my code review 💀😂

${toneEmojis[tone]} Sarcastic Mode on @Dumbify is SAVAGE and I'm here for it!

Get roasted (for free): dumbify.dev

#DumbifyThis #CodeRoast #Developer #AI #SarcasticMode`,
      
      influencer: `Bestie, this AI just explained my code better than my CS professor 💅✨

@Dumbify's Influencer Mode is serving LOOKS and KNOWLEDGE!

Link in bio... just kidding → dumbify.dev

#DumbifyThis #TechInfluencer #CodeExplained #AI #Slay`,
      
      professor: `Fascinating! AI providing comprehensive code analysis with academic rigor 👨‍🏫

@Dumbify's Professor Mode delivers dissertation-level explanations instantly.

Research it yourself: dumbify.dev

#DumbifyThis #AcademicAI #CodeAnalysis #ComputerScience`
    }
    
    const text = viralTexts[tone] || viralTexts.baby
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
  }

  const shareToLinkedIn = () => {
    const professionalTexts = {
      baby: 'Simplifying complex code explanations with AI - making development more accessible to everyone!',
      sarcastic: 'AI-powered code review with personality - sometimes a little humor makes debugging more bearable!',
      influencer: 'Innovative AI tool transforming how we communicate technical concepts across teams.',
      professor: 'Advanced AI providing comprehensive code analysis and documentation - impressive technological capability!'
    }
    
    const text = `${professionalTexts[tone]} Just tried Dumbify's ${toneLabels[tone]} and it's game-changing for developer productivity. #AI #CodeExplained #DeveloperTools`
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://dumbify.dev')}&title=${encodeURIComponent(text)}`, '_blank')
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  const nextTemplate = () => {
    setActiveTemplate((prev) => (prev + 1) % cardTemplates.length)
  }

  const prevTemplate = () => {
    setActiveTemplate((prev) => (prev - 1 + cardTemplates.length) % cardTemplates.length)
  }

  const getCardContent = () => {
    const template = cardTemplates[activeTemplate]
    
    switch (template.id) {
      case 'modern':
        return <ModernGradientCard code={code} overview={overview} tone={tone} />
      case 'developer':
        return <DeveloperDarkCard code={code} overview={overview} tone={tone} />
      case 'minimal':
        return <MinimalWhiteCard code={code} overview={overview} tone={tone} />
      case 'retro':
        return <RetroNeonCard code={code} overview={overview} tone={tone} />
      case 'professional':
        return <ProfessionalCard code={code} overview={overview} tone={tone} />
      default:
        return <ModernGradientCard code={code} overview={overview} tone={tone} />
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            📸 Share Your Explanation
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Create beautiful cards for social media
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span>{cardTemplates[activeTemplate].name}</span>
          <span>•</span>
          <span>{activeTemplate + 1}/{cardTemplates.length}</span>
        </div>
      </div>

      {/* Card Preview */}
      <div className="relative mb-6">
        <div className="relative overflow-hidden rounded-lg">
          <div 
            ref={cardRef}
            className="w-full aspect-square max-w-md mx-auto"
            style={{ width: '400px', height: '400px' }}
          >
            {getCardContent()}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevTemplate}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={nextTemplate}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Template Dots */}
        <div className="flex justify-center mt-4 gap-2">
          {cardTemplates.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveTemplate(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === activeTemplate 
                  ? 'bg-blue-500' 
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Template Selector */}
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-2">
          {cardTemplates.map((template, index) => (
            <button
              key={template.id}
              onClick={() => setActiveTemplate(index)}
              className={`p-3 rounded-lg border transition-all text-left ${
                index === activeTemplate
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="font-medium text-sm text-gray-900 dark:text-white">
                {template.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {template.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={generateImage}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors text-sm font-medium"
        >
          <Download className="w-4 h-4" />
          {isGenerating ? 'Generating...' : 'Download'}
        </button>
        
        <button
          onClick={shareToTwitter}
          className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition-colors text-sm font-medium"
        >
          <Twitter className="w-4 h-4" />
          Twitter
        </button>
        
        <button
          onClick={shareToLinkedIn}
          className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors text-sm font-medium"
        >
          <Linkedin className="w-4 h-4" />
          LinkedIn
        </button>
        
        <button
          onClick={copyLink}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm font-medium"
        >
          <Copy className="w-4 h-4" />
          Copy Link
        </button>
      </div>
    </div>
  )
}

// Card Templates
function ModernGradientCard({ code, overview, tone }: { code: string, overview: string, tone: string }) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-8 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-4 w-32 h-32 border border-white/30 rounded-full"></div>
        <div className="absolute bottom-4 right-4 w-24 h-24 border border-white/30 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl font-bold opacity-5">
          DUMBIFY
        </div>
      </div>
      
      <div className="relative z-10 h-full flex flex-col">
        {/* Header with Prominent Branding */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/30">
              <span className="text-2xl font-bold text-white">D</span>
            </div>
            <div>
              <div className="font-bold text-xl">DUMBIFY</div>
              <div className="text-sm opacity-90">Code Made Simple</div>
            </div>
          </div>
          <span className="text-3xl">{toneEmojis[tone as keyof typeof toneEmojis]}</span>
        </div>
        
        <div className="flex-1 space-y-4">
          <div className="bg-black/20 rounded-lg p-4 backdrop-blur-sm border border-white/20">
            <div className="text-xs opacity-75 mb-2 flex items-center gap-2">
              <span>💻 CODE INPUT</span>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{toneLabels[tone as keyof typeof toneLabels]}</span>
            </div>
            <div className="font-mono text-sm leading-relaxed">
              {code.length > 90 ? code.substring(0, 90) + '...' : code}
            </div>
          </div>
          
          <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm border border-white/20">
            <div className="text-xs opacity-75 mb-2">✨ AI EXPLANATION</div>
            <div className="text-sm leading-relaxed">
              {overview.length > 100 ? overview.substring(0, 100) + '...' : overview}
            </div>
          </div>
        </div>
        
        {/* Viral Call-to-Action Footer */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 mt-4">
          <div className="text-center">
            <div className="text-lg font-bold mb-1">🚀 Try Dumbify FREE!</div>
            <div className="text-sm opacity-90 mb-2">Explain YOUR code in hilarious ways</div>
            <div className="flex items-center justify-center gap-4 text-xs">
              <span>dumbify.dev</span>
              <span>•</span>
              <span>#DumbifyThis</span>
              <span>•</span>
              <span>@DumbifyApp</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DeveloperDarkCard({ code, overview, tone }: { code: string, overview: string, tone: string }) {
  return (
    <div className="w-full h-full bg-gray-900 p-8 text-green-400 relative font-mono">
      {/* Terminal-style background */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-gray-800 flex items-center px-4 border-b border-gray-700">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="ml-4 text-gray-400 text-xs font-bold">DUMBIFY TERMINAL v2.0</div>
        <div className="ml-auto text-gray-500 text-xs">dumbify.dev</div>
      </div>
      
      <div className="mt-16 space-y-4">
        <div className="text-blue-400">
          <span className="text-gray-500">$</span> dumbify --mode={tone} --explain --viral
        </div>
        
        <div className="bg-gray-800 rounded p-4 border-l-4 border-blue-500">
          <div className="text-gray-400 text-xs mb-2 flex items-center gap-2">
            <span>// INPUT CODE</span>
            <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">{toneLabels[tone as keyof typeof toneLabels]}</span>
          </div>
          <div className="text-sm text-white">
            {code.length > 70 ? code.substring(0, 70) + '...' : code}
          </div>
        </div>
        
        <div className="text-green-400 flex items-center gap-2">
          <span className="text-gray-500">&gt;</span> 
          <span>{toneEmojis[tone as keyof typeof toneEmojis]} Processing with AI magic...</span>
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
            <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse delay-75"></div>
            <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse delay-150"></div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded p-4 border-l-4 border-green-500">
          <div className="text-gray-400 text-xs mb-2">// AI OUTPUT</div>
          <div className="text-sm text-green-400">
            {overview.length > 80 ? overview.substring(0, 80) + '...' : overview}
          </div>
        </div>
        
        {/* Viral Terminal Commands */}
        <div className="space-y-2">
          <div className="text-cyan-400">
            <span className="text-gray-500">$</span> echo "Mind = Blown 🤯"
          </div>
          <div className="text-yellow-400">
            <span className="text-gray-500">$</span> curl -X POST "dumbify.dev/try-free"
          </div>
          <div className="text-pink-400">
            <span className="text-gray-500">$</span> share --platform="all" --hashtag="#DumbifyThis"
          </div>
        </div>
        
        {/* Footer */}
        <div className="border-t border-gray-700 pt-4 flex justify-between items-center text-xs">
          <div className="text-gray-500">
            <span className="text-green-400">✓</span> Powered by DUMBIFY
          </div>
          <div className="text-blue-400 font-bold">
            FREE → dumbify.dev
          </div>
        </div>
      </div>
    </div>
  )
}

function MinimalWhiteCard({ code, overview, tone }: { code: string, overview: string, tone: string }) {
  return (
    <div className="w-full h-full bg-white p-8 text-gray-800 relative">
      <div className="h-full flex flex-col">
        {/* Header with Logo */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">Dumbify</div>
              <div className="text-sm text-gray-500">AI Code Explainer</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl mb-1">{toneEmojis[tone as keyof typeof toneEmojis]}</div>
            <div className="text-xs text-blue-600 font-medium">{toneLabels[tone as keyof typeof toneLabels]}</div>
          </div>
        </div>
        
        <div className="flex-1 space-y-6">
          <div className="border-l-4 border-gray-200 pl-4 bg-gray-50 p-4 rounded-r-lg">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-semibold">CODE INPUT</div>
            <div className="font-mono text-sm">
              {code.length > 80 ? code.substring(0, 80) + '...' : code}
            </div>
          </div>
          
          <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-4 rounded-r-lg">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-semibold">AI EXPLANATION</div>
            <div className="text-sm leading-relaxed">
              {overview.length > 110 ? overview.substring(0, 110) + '...' : overview}
            </div>
          </div>
        </div>
        
        {/* Viral Call-to-Action */}
        <div className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mt-6 text-center">
          <div className="text-lg font-bold text-blue-600 mb-2">
            🎯 Want to explain YOUR code?
          </div>
          <div className="text-sm text-gray-600 mb-3">
            Join thousands of developers using Dumbify!
          </div>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <span className="font-semibold text-blue-600">FREE</span>
            <span>•</span>
            <span>dumbify.dev</span>
            <span>•</span>
            <span>#CodeExplained</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function RetroNeonCard({ code, overview, tone }: { code: string, overview: string, tone: string }) {
  return (
    <div className="w-full h-full bg-black p-8 text-white relative overflow-hidden">
      {/* Neon grid background */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
          {Array.from({ length: 64 }).map((_, i) => (
            <div key={i} className="border border-cyan-500/30"></div>
          ))}
        </div>
      </div>
      
      {/* Glowing Dumbify Logo */}
      <div className="absolute top-4 left-4">
        <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-500 animate-pulse">
          DUMBIFY
        </div>
        <div className="text-xs text-cyan-400">CODE • SIMPLIFIED</div>
      </div>
      
      <div className="relative z-10 h-full pt-16">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3 animate-bounce">{toneEmojis[tone as keyof typeof toneEmojis]}</div>
          <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-500">
            {toneLabels[tone as keyof typeof toneLabels]}
          </div>
          <div className="text-sm text-cyan-400 mt-1">ACTIVATED</div>
        </div>
        
        <div className="space-y-4">
          <div className="border border-pink-500 rounded p-4 bg-pink-500/10 backdrop-blur shadow-lg shadow-pink-500/20">
            <div className="text-pink-400 text-xs mb-2 font-bold flex items-center gap-2">
              <span>// CODE INPUT</span>
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-ping"></div>
            </div>
            <div className="font-mono text-sm">
              {code.length > 70 ? code.substring(0, 70) + '...' : code}
            </div>
          </div>
          
          <div className="border border-cyan-500 rounded p-4 bg-cyan-500/10 backdrop-blur shadow-lg shadow-cyan-500/20">
            <div className="text-cyan-400 text-xs mb-2 font-bold flex items-center gap-2">
              <span>// AI MAGIC OUTPUT</span>
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping"></div>
            </div>
            <div className="text-sm">
              {overview.length > 90 ? overview.substring(0, 90) + '...' : overview}
            </div>
          </div>
        </div>
        
        {/* Retro Viral Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-pink-500/20 to-cyan-500/20 backdrop-blur-sm border-t border-pink-500/50 p-4">
          <div className="text-center">
            <div className="text-lg font-bold mb-2">
              <span className="text-pink-500">█</span>
              <span className="text-white"> GET DUMBIFY FREE </span>
              <span className="text-cyan-500">█</span>
            </div>
            <div className="flex items-center justify-center gap-4 text-xs">
              <span className="text-pink-500">★</span>
              <span className="text-cyan-400 font-bold">dumbify.dev</span>
              <span className="text-pink-500">★</span>
              <span className="text-cyan-400">#DumbifyThis</span>
              <span className="text-pink-500">★</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProfessionalCard({ code, overview, tone }: { code: string, overview: string, tone: string }) {
  return (
    <div className="w-full h-full bg-white p-8 text-gray-800 relative">
      {/* Professional Header */}
      <div className="border-b-4 border-blue-600 pb-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">D</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">DUMBIFY</div>
              <div className="text-sm text-gray-600 font-medium">Professional Code Intelligence</div>
              <div className="text-xs text-gray-500">Trusted by 50,000+ developers</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl mb-1">{toneEmojis[tone as keyof typeof toneEmojis]}</div>
            <div className="text-xs text-gray-500 font-medium">{toneLabels[tone as keyof typeof toneLabels]}</div>
          </div>
        </div>
      </div>
      
      <div className="flex-1">
        <div className="mb-6">
          <div className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
            CODE ANALYSIS REPORT
          </div>
          <div className="bg-gray-100 p-4 rounded-lg border-l-4 border-blue-600">
            <div className="font-mono text-sm">
              {code.length > 90 ? code.substring(0, 90) + '...' : code}
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-3 h-3 bg-green-600 rounded-full"></span>
            AI-POWERED EXPLANATION
          </div>
          <div className="text-sm leading-relaxed bg-green-50 p-4 rounded-lg border-l-4 border-green-600">
            {overview.length > 110 ? overview.substring(0, 110) + '...' : overview}
          </div>
        </div>
      </div>
      
      {/* Professional CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-6 mt-6">
        <div className="text-center">
          <div className="text-lg font-bold mb-2">
            🚀 Boost Your Development Workflow
          </div>
          <div className="text-sm opacity-90 mb-3">
            Join leading companies using Dumbify for code documentation
          </div>
          <div className="flex items-center justify-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              <span>FREE TRIAL</span>
            </div>
            <span>dumbify.dev</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              <span>ENTERPRISE READY</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Professional Footer */}
      <div className="border-t pt-4 mt-6">
        <div className="flex justify-between items-center text-xs text-gray-500">
          <div>© 2024 Dumbify • Professional AI Code Analysis</div>
          <div className="font-medium text-blue-600">#CodeMadeSimple</div>
        </div>
      </div>
    </div>
  )
} 