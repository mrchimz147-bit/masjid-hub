import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Fetch published FAQ questions
export async function GET() {
  try {
    const questions = await db.question.findMany({
      where: {
        isPublished: true,
        isAnswered: true,
      },
      include: {
        user: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json(questions)
  } catch (error) {
    console.error('Error fetching questions:', error)
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
  }
}

// POST - Submit a new question
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { question, userId } = body

    if (!question || question.trim().length < 10) {
      return NextResponse.json(
        { error: 'Question must be at least 10 characters long' },
        { status: 400 }
      )
    }

    // Use a default user ID if not provided (for anonymous submissions)
    const defaultUser = await db.user.findFirst()
    const effectiveUserId = userId || defaultUser?.id

    if (!effectiveUserId) {
      return NextResponse.json({ error: 'No user found' }, { status: 400 })
    }

    const newQuestion = await db.question.create({
      data: {
        userId: effectiveUserId,
        question: question.trim(),
      },
    })

    return NextResponse.json(newQuestion, { status: 201 })
  } catch (error) {
    console.error('Error creating question:', error)
    return NextResponse.json({ error: 'Failed to submit question' }, { status: 500 })
  }
}
