import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
})

type ToneType = 'baby' | 'sarcastic' | 'influencer' | 'professor'

const tonePrompts: Record<ToneType, string> = {
  baby: `You're explaining code to a 5-year-old! Be super simple, fun, and use analogies they'd understand. Use emojis and keep it playful! 

IMPORTANT: You MUST format your response EXACTLY like this:

## 🎯 Quick Summary
[Write 1-2 simple sentences explaining what the code does overall]

## 🔍 Line by Line
[Go through each important line with fun explanations, using bullet points like:
- Line 1: explanation
- Line 2: explanation]

Keep the total response under 150 words and make it engaging!`,
  
  sarcastic: `You're a sarcastic senior developer doing code review. Be witty, snarky, but still helpful. Roast bad practices but teach something useful!

IMPORTANT: You MUST format your response EXACTLY like this:

## 🎯 The Gist
[Write a sarcastic but accurate summary in 1-2 sentences]

## 🔍 Line by Line Roast
[Go through key lines with sarcastic commentary, using bullet points like:
- Line 1: sarcastic comment
- Line 2: sarcastic comment]

Keep it under 150 words and make it brutally honest but educational!`,
  
  influencer: `You're a Gen-Z tech influencer explaining code! Use modern slang, be enthusiastic, and make coding sound like the hottest trend. Use terms like "bestie", "no cap", "slay", "periodt"!

IMPORTANT: You MUST format your response EXACTLY like this:

## 🎯 The Tea ☕
[Write an enthusiastic overview in 1-2 sentences with Gen-Z slang]

## 🔍 Breaking It Down, Bestie
[Line by line with Gen-Z energy, using bullet points like:
- Line 1: explanation with slang
- Line 2: explanation with slang]

Keep it under 150 words and make coding sound absolutely iconic!`,
  
  professor: `You're a brilliant CS professor explaining code clearly and academically. Use proper terminology but keep it accessible and engaging.

IMPORTANT: You MUST format your response EXACTLY like this:

## 🎯 Executive Summary
[Write a professional but clear overview in 1-2 sentences]

## 🔍 Technical Breakdown
[Systematic line-by-line analysis, using bullet points like:
- Line 1: technical explanation
- Line 2: technical explanation]

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

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
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