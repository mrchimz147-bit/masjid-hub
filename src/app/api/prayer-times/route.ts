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

// POST - Update or create prayer times for a specific date
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { date, fajr, sunrise, dhuhr, asr, maghrib, isha } = data

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 })
    }

    // Parse date
    const prayerDate = new Date(date)
    prayerDate.setHours(0, 0, 0, 0)

    // Upsert prayer times
    const prayerTime = await db.prayerTime.upsert({
      where: { date: prayerDate },
      update: {
        fajr: fajr || '05:00',
        sunrise: sunrise || '06:15',
        dhuhr: dhuhr || '12:30',
        asr: asr || '15:45',
        maghrib: maghrib || '18:00',
        isha: isha || '19:15',
      },
      create: {
        date: prayerDate,
        fajr: fajr || '05:00',
        sunrise: sunrise || '06:15',
        dhuhr: dhuhr || '12:30',
        asr: asr || '15:45',
        maghrib: maghrib || '18:00',
        isha: isha || '19:15',
      },
    })

    return NextResponse.json({ success: true, prayerTime })
  } catch (error) {
    console.error('Error updating prayer times:', error)
    return NextResponse.json({ error: 'Failed to update prayer times' }, { status: 500 })
  }
}

// PUT - Bulk update prayer times for multiple days
export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const { times } = data // Array of { date, fajr, sunrise, dhuhr, asr, maghrib, isha }

    if (!Array.isArray(times)) {
      return NextResponse.json({ error: 'Times array is required' }, { status: 400 })
    }

    const results = []
    for (const time of times) {
      const prayerDate = new Date(time.date)
      prayerDate.setHours(0, 0, 0, 0)

      const result = await db.prayerTime.upsert({
        where: { date: prayerDate },
        update: {
          fajr: time.fajr,
          sunrise: time.sunrise,
          dhuhr: time.dhuhr,
          asr: time.asr,
          maghrib: time.maghrib,
          isha: time.isha,
        },
        create: {
          date: prayerDate,
          fajr: time.fajr,
          sunrise: time.sunrise,
          dhuhr: time.dhuhr,
          asr: time.asr,
          maghrib: time.maghrib,
          isha: time.isha,
        },
      })
      results.push(result)
    }

    return NextResponse.json({ success: true, updated: results.length })
  } catch (error) {
    console.error('Error bulk updating prayer times:', error)
    return NextResponse.json({ error: 'Failed to update prayer times' }, { status: 500 })
  }
}
