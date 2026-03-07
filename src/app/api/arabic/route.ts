import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Get Arabic learning content
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    
    const where = category ? { category } : {}
    
    const content = await db.arabicContent.findMany({
      where,
      orderBy: [{ category: 'asc' }, { order: 'asc' }]
    })
    
    // Group by category
    const grouped = content.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = []
      }
      acc[item.category].push(item)
      return acc
    }, {} as Record<string, typeof content>)
    
    return NextResponse.json({ success: true, content, grouped })
  } catch (error) {
    console.error('Error fetching Arabic content:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch Arabic content' }, { status: 500 })
  }
}

// POST - Create Arabic content (admin)
export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const content = await db.arabicContent.create({
      data: {
        category: data.category,
        letter: data.letter,
        arabicText: data.arabicText,
        transliteration: data.transliteration,
        translation: data.translation,
        audioUrl: data.audioUrl,
        imageUrl: data.imageUrl,
        description: data.description,
        order: data.order || 0,
      }
    })
    
    return NextResponse.json({ success: true, content })
  } catch (error) {
    console.error('Error creating Arabic content:', error)
    return NextResponse.json({ success: false, error: 'Failed to create Arabic content' }, { status: 500 })
  }
}
