import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET all livestreams or active stream
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const isLive = searchParams.get('live')
    const eventType = searchParams.get('eventType')

    const where: Record<string, unknown> = {}
    if (isLive === 'true') where.isLive = true
    if (eventType) where.eventType = eventType

    const streams = await db.liveStream.findMany({
      where,
      orderBy: { scheduledAt: 'desc' },
    })

    return NextResponse.json(streams)
  } catch (error) {
    console.error('Error fetching livestreams:', error)
    return NextResponse.json({ error: 'Failed to fetch streams' }, { status: 500 })
  }
}

// POST - Create new livestream
export async function POST(request: Request) {
  try {
    const data = await request.json()

    const stream = await db.liveStream.create({
      data: {
        title: data.title,
        description: data.description,
        streamUrl: data.streamUrl,
        streamType: data.streamType || 'youtube',
        eventType: data.eventType || 'jumuah',
        isLive: data.isLive || false,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      }
    })

    return NextResponse.json({ success: true, stream })
  } catch (error) {
    console.error('Error creating livestream:', error)
    return NextResponse.json({ error: 'Failed to create stream' }, { status: 500 })
  }
}

// PUT - Update livestream (start/end)
export async function PUT(request: Request) {
  try {
    const { id, isLive, endedAt } = await request.json()

    const stream = await db.liveStream.update({
      where: { id },
      data: {
        isLive,
        endedAt: endedAt ? new Date(endedAt) : null,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({ success: true, stream })
  } catch (error) {
    console.error('Error updating livestream:', error)
    return NextResponse.json({ error: 'Failed to update stream' }, { status: 500 })
  }
}

// DELETE livestream
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Stream ID required' }, { status: 400 })
    }

    await db.liveStream.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting livestream:', error)
    return NextResponse.json({ error: 'Failed to delete stream' }, { status: 500 })
  }
}
