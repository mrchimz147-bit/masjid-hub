import { NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: Request) {
  try {
    const { question, language = 'en', audioBase64, enableTTS = false } = await request.json()

    let userQuestion = question

    // If audio is provided, convert speech to text
    if (audioBase64 && !question) {
      try {
        const zai = await ZAI.create()
        
        // Use ASR to convert audio to text
        const asrResponse = await zai.functions.invoke("asr", {
          audio: audioBase64,
          language: language === 'ar' ? 'ar' : 'en'
        })
        
        if (asrResponse && asrResponse.text) {
          userQuestion = asrResponse.text
        } else {
          return NextResponse.json({ 
            success: false, 
            error: 'Could not understand the audio. Please try again.' 
          }, { status: 400 })
        }
      } catch (asrError) {
        console.error('ASR error:', asrError)
        return NextResponse.json({ 
          success: false, 
          error: 'Speech recognition failed. Please try typing your question.' 
        }, { status: 400 })
      }
    }

    if (!userQuestion) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 })
    }

    const zai = await ZAI.create()

    // Create a system prompt for Shafi Sunni Islamic guidance
    const systemPrompt = `You are a knowledgeable Islamic scholar assistant for Zeenat-ul-Islam Masjid in Bulawayo, Zimbabwe. 
    You provide guidance according to the Shafi'i school of thought (madhhab) and Sunni Islam.
    
    Guidelines:
    - Provide clear, practical answers based on Shafi'i fiqh
    - Reference Quran and Hadith when applicable
    - If there are differences of opinion, mention them respectfully
    - For complex issues, advise consulting the local Imam in person
    - Be respectful, compassionate, and non-judgmental
    - Keep answers concise but thorough
    - If you don't know something, admit it and suggest consulting a scholar
    - Respond in ${language === 'en' ? 'English' : language === 'nd' ? 'Ndebele' : language === 'ar' ? 'Arabic' : 'Shona'}
    
    Remember: This is general guidance. For specific personal situations, encourage the user to consult the Imam directly.`

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userQuestion }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    let answer = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again or consult the Imam directly.'
    
    // If TTS is enabled, generate audio response
    let audioResponse = null
    if (enableTTS) {
      try {
        const ttsResponse = await zai.functions.invoke("tts", {
          text: answer,
          language: language === 'ar' ? 'ar' : 'en'
        })
        
        if (ttsResponse && ttsResponse.audio) {
          audioResponse = ttsResponse.audio
        }
      } catch (ttsError) {
        console.error('TTS error:', ttsError)
        // Continue without audio if TTS fails
      }
    }

    return NextResponse.json({
      success: true,
      question: userQuestion,
      answer,
      audio: audioResponse,
      source: 'AI Assistant (Shafi\'i School)',
    })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({
      success: false,
      error: 'Unable to process your question. Please try again later.',
      fallback: true,
    }, { status: 500 })
  }
}

// TTS-only endpoint for converting text to speech
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const text = searchParams.get('text')
    const language = searchParams.get('language') || 'en'
    
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }
    
    const zai = await ZAI.create()
    
    const ttsResponse = await zai.functions.invoke("tts", {
      text,
      language: language === 'ar' ? 'ar' : 'en'
    })
    
    if (ttsResponse && ttsResponse.audio) {
      return NextResponse.json({
        success: true,
        audio: ttsResponse.audio
      })
    }
    
    return NextResponse.json({
      success: false,
      error: 'Could not generate audio'
    }, { status: 400 })
  } catch (error) {
    console.error('TTS error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to generate audio'
    }, { status: 500 })
  }
}
