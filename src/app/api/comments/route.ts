import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET comments for an announcement
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const announcementId = searchParams.get('announcementId')

    if (!announcementId) {
      return NextResponse.json({ error: 'Announcement ID is required' }, { status: 400 })
    }

    const comments = await db.comment.findMany({
      where: {
        announcementId,
        isApproved: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ comments })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

// POST a new comment
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { announcementId, name, content } = body

    if (!announcementId || !name || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const comment = await db.comment.create({
      data: {
        announcementId,
        name,
        content,
        isApproved: true, // Auto-approve for now
      },
    })

    return NextResponse.json({ success: true, comment })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
  }
}
