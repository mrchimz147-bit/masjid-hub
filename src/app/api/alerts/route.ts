import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET all alerts or active alerts
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const alertType = searchParams.get('type')

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (alertType) where.alertType = alertType

    const alerts = await db.alert.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        member: {
          select: { firstName: true, lastName: true, phone: true, address: true, latitude: true, longitude: true }
        }
      }
    })

    return NextResponse.json(alerts)
  } catch (error) {
    console.error('Error fetching alerts:', error)
    return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 })
  }
}

// POST - Create new alert (panic button)
export async function POST(request: Request) {
  try {
    const data = await request.json()

    const alert = await db.alert.create({
      data: {
        userId: data.userId,
        memberId: data.memberId,
        alertType: data.alertType || 'panic',
        message: data.message,
        location: data.location,
        latitude: data.latitude ? parseFloat(data.latitude) : null,
        longitude: data.longitude ? parseFloat(data.longitude) : null,
        status: 'active',
      }
    })

    return NextResponse.json({ success: true, alert })
  } catch (error) {
    console.error('Error creating alert:', error)
    return NextResponse.json({ error: 'Failed to create alert' }, { status: 500 })
  }
}

// PUT - Update alert status (respond/resolve)
export async function PUT(request: Request) {
  try {
    const { id, status, respondedBy, notes } = await request.json()

    const updateData: Record<string, unknown> = {
      status,
      updatedAt: new Date()
    }

    if (status === 'responded') {
      updateData.respondedAt = new Date()
      updateData.respondedBy = respondedBy
    }
    if (status === 'resolved') {
      updateData.resolvedAt = new Date()
    }
    if (notes) updateData.notes = notes

    const alert = await db.alert.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ success: true, alert })
  } catch (error) {
    console.error('Error updating alert:', error)
    return NextResponse.json({ error: 'Failed to update alert' }, { status: 500 })
  }
}

// DELETE alert
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Alert ID required' }, { status: 400 })
    }

    await db.alert.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting alert:', error)
    return NextResponse.json({ error: 'Failed to delete alert' }, { status: 500 })
  }
}
