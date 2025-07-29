import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
})

type ToneType = 'baby' | 'sarcastic' | 'influencer' | 'professor'

const socialMediaPrompts: Record<ToneType, string> = {
  baby: `Create a social media post explaining this code to a 5-year-old. Structure your response exactly like this:

## CODE_OVERVIEW
[Write a short, simple explanation of what this code does overall. Use emojis and keep it playful! 2-3 sentences max.]

## QUICK_SUMMARY
[Write a very brief summary perfect for a social media card. 1-2 sentences. Make it engaging with emojis!]

## BREAKDOWN_1
[Explain the first main part of the code in simple terms with emojis]

## BREAKDOWN_2
[Explain the second main part of the code in simple terms with emojis]

## BREAKDOWN_3
[Explain the third main part of the code in simple terms with emojis]

Only include BREAKDOWN sections that are actually needed. Keep each section concise and social media friendly!`,

  sarcastic: `Craft a witty and sarcastic social media post reviewing this code. Structure your response exactly like this:

## CODE_OVERVIEW
[Write a snarky but insightful overview of what this code does. 2-3 sentences max.]

## QUICK_SUMMARY
[Write a brief, witty summary perfect for a social media card. 1-2 sentences. Be snarky but informative!]

## BREAKDOWN_1
[Sarcastically explain the first main part with clever insights]

## BREAKDOWN_2
[Sarcastically explain the second main part with clever insights]

## BREAKDOWN_3
[Sarcastically explain the third main part with clever insights]

Only include BREAKDOWN sections that are actually needed. Keep each section punchy and social media ready!`,

  influencer: `Write an enthusiastic social media post about this code as if you're a Gen-Z influencer. Structure your response exactly like this:

## CODE_OVERVIEW
[Write an excited overview of what this code does using modern slang and emojis. 2-3 sentences max.]

## QUICK_SUMMARY
[Write a trendy, engaging summary perfect for a social media card. 1-2 sentences. Make it sound cool!]

## BREAKDOWN_1
[Explain the first main part using Gen-Z slang and enthusiasm]

## BREAKDOWN_2
[Explain the second main part using Gen-Z slang and enthusiasm]

## BREAKDOWN_3
[Explain the third main part using Gen-Z slang and enthusiasm]

Only include BREAKDOWN sections that are actually needed. Keep it fresh and social media worthy!`,

  professor: `Compose a clear and academic social media post explaining this code. Structure your response exactly like this:

## CODE_OVERVIEW
[Write a clear, academic overview of what this code accomplishes. 2-3 sentences max.]

## QUICK_SUMMARY
[Write a concise, professional summary perfect for a social media card. 1-2 sentences. Keep it accessible!]

## BREAKDOWN_1
[Explain the first main concept with proper terminology but accessible language]

## BREAKDOWN_2
[Explain the second main concept with proper terminology but accessible language]

## BREAKDOWN_3
[Explain the third main concept with proper terminology but accessible language]

Only include BREAKDOWN sections that are actually needed. Keep each section clear and educational!`
}

export async function POST(request: NextRequest) {
  try {
    const { code, tone }: { code: string; tone: ToneType } = await request.json()

    if (!code || !code.trim()) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 })
    }

    if (!tone || !socialMediaPrompts[tone]) {
      return NextResponse.json({ error: 'Valid tone is required' }, { status: 400 })
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      )
    }

    const systemPrompt = socialMediaPrompts[tone]
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Create a social media post for this code with the specified format and tone:\n\n\
${code}\n\
`
        }
      ],
      max_tokens: 350,
      temperature: 0.8,
    })

    const socialMediaContent = completion.choices[0]?.message?.content

    if (!socialMediaContent) {
      return NextResponse.json(
        { error: 'Failed to generate social media content' },
        { status: 500 }
      )
    }

    return NextResponse.json({ socialMediaContent })

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