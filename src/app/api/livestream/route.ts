import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Sample livestreams for demo/fallback
const SAMPLE_STREAMS = [
  {
    id: 'sample-1',
    title: 'Jumu\'ah Khutbah',
    description: 'Weekly Friday Khutbah and Prayer',
    streamUrl: 'https://www.youtube.com/embed/live_stream',
    streamType: 'youtube',
    eventType: 'jumuah',
    isLive: false,
    scheduledAt: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample-2',
    title: 'Daily Quran Class',
    description: 'Evening Quran recitation and tafsir',
    streamUrl: 'https://www.youtube.com/embed/live_stream',
    streamType: 'youtube',
    eventType: 'bayaan',
    isLive: false,
    scheduledAt: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample-3',
    title: 'Previous Eid Khutbah',
    description: 'Recorded Eid al-Fitr Khutbah',
    streamUrl: 'https://www.youtube.com/embed/live_stream',
    streamType: 'youtube',
    eventType: 'eid',
    isLive: false,
    scheduledAt: null,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
]

// GET all livestreams or active stream
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const isLive = searchParams.get('live')
    const eventType = searchParams.get('eventType')

    const where: Record<string, unknown> = {}
    if (isLive === 'true') where.isLive = true
    if (eventType) where.eventType = eventType

    let streams = []
    try {
      streams = await db.liveStream.findMany({
        where,
        orderBy: { scheduledAt: 'desc' },
      })
    } catch (dbError) {
      console.log('Database not available, using sample streams')
    }

    // Return sample streams if database is empty
    if (streams.length === 0) {
      streams = SAMPLE_STREAMS
    }

    return NextResponse.json(streams)
  } catch (error) {
    console.error('Error fetching livestreams:', error)
    return NextResponse.json(SAMPLE_STREAMS)
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
