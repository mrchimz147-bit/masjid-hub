import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Fetch all bookings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where = status ? { status } : {}

    const bookings = await db.booking.findMany({
      where,
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
      orderBy: { date: 'asc' },
      take: 100,
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}

// POST - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, facility, purpose, date, startTime, endTime, notes } = body

    // Validate required fields
    if (!facility || !purpose || !date || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Use default user if not provided
    const defaultUser = await db.user.findFirst()
    const effectiveUserId = userId || defaultUser?.id

    if (!effectiveUserId) {
      return NextResponse.json({ error: 'No user found' }, { status: 400 })
    }

    const booking = await db.booking.create({
      data: {
        userId: effectiveUserId,
        facility,
        purpose,
        date: new Date(date),
        startTime,
        endTime,
        notes,
      },
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}
