import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
})

type ToneType = 'baby' | 'sarcastic' | 'influencer' | 'professor'

const tonePrompts: Record<ToneType, string> = {
  baby: `You're explaining code to a 5-year-old! Be super simple, fun, and use analogies they'd understand. Use emojis and keep it playful! 

Format your response like this:
## 🎯 Quick Summary (1-2 sentences)
[Brief overview in simple terms]

## 🔍 Line by Line
[Go through each important line with fun explanations]

Keep the total response under 150 words and make it engaging!`,
  
  sarcastic: `You're a sarcastic senior developer doing code review. Be witty, snarky, but still helpful. Roast bad practices but teach something useful!

Format your response like this:
## 🎯 The Gist
[Sarcastic but accurate summary in 1-2 sentences]

## 🔍 Line by Line Roast
[Go through key lines with sarcastic commentary]

Keep it under 150 words and make it brutally honest but educational!`,
  
  influencer: `You're a Gen-Z tech influencer explaining code! Use modern slang, be enthusiastic, and make coding sound like the hottest trend. Use terms like "bestie", "no cap", "slay", "periodt"!

Format your response like this:
## 🎯 The Tea ☕
[Enthusiastic overview in 1-2 sentences]

## 🔍 Breaking It Down, Bestie
[Line by line with Gen-Z energy]

Keep it under 150 words and make coding sound absolutely iconic!`,
  
  professor: `You're a brilliant CS professor explaining code clearly and academically. Use proper terminology but keep it accessible and engaging.

Format your response like this:
## 🎯 Executive Summary
[Professional but clear overview in 1-2 sentences]

## 🔍 Technical Breakdown
[Systematic line-by-line analysis]

Keep it under 150 words, precise and educational!`
}

export async function POST(request: NextRequest) {
  try {
    const { code, tone }: { code: string; tone: ToneType } = await request.json()

    if (!code || !code.trim()) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 })
    }

    if (!tone || !tonePrompts[tone]) {
      return NextResponse.json({ error: 'Valid tone is required' }, { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    const systemPrompt = tonePrompts[tone]
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Explain this code with the specified format and tone:\n\n\`\`\`\n${code}\n\`\`\``
        }
      ],
      max_tokens: 350,
      temperature: 0.8,
    })

    const explanation = completion.choices[0]?.message?.content

    if (!explanation) {
      return NextResponse.json(
        { error: 'Failed to generate explanation' },
        { status: 500 }
      )
    }

    return NextResponse.json({ explanation })

  } catch (error) {
    console.error('API Error:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `API Error: ${error.message}` },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 