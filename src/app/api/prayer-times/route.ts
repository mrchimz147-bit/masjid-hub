import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Get prayer times for the next 30 days
    const prayerTimes = await db.prayerTime.findMany({
      where: {
        date: {
          gte: today,
        },
      },
      orderBy: {
        date: 'asc',
      },
      take: 30,
    })

    return NextResponse.json(prayerTimes)
  } catch (error) {
    console.error('Error fetching prayer times:', error)
    return NextResponse.json({ error: 'Failed to fetch prayer times' }, { status: 500 })
  }
}
