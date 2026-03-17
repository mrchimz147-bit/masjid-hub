import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Fetch donation history
export async function GET() {
  try {
    const donations = await db.donation.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    return NextResponse.json(donations)
  } catch (error) {
    console.error('Error fetching donations:', error)
    return NextResponse.json({ error: 'Failed to fetch donations' }, { status: 500 })
  }
}

// POST - Record a new donation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      amount,
      type,
      paymentMethod,
      donorName,
      donorEmail,
      donorPhone,
    } = body

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid donation amount' },
        { status: 400 }
      )
    }

    const donation = await db.donation.create({
      data: {
        amount: parseFloat(amount),
        type: type || 'general',
        paymentMethod,
        donorName,
        donorEmail,
        donorPhone,
        paymentStatus: 'pending',
      },
    })

    return NextResponse.json(donation, { status: 201 })
  } catch (error) {
    console.error('Error creating donation:', error)
    return NextResponse.json({ error: 'Failed to record donation' }, { status: 500 })
  }
}
