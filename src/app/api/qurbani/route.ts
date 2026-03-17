import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Animal types and pricing
const ANIMAL_TYPES = {
  sheep: { name: 'Sheep', shares: 1, priceRange: [150, 300] },
  goat: { name: 'Goat', shares: 1, priceRange: [150, 300] },
  cow: { name: 'Cow', shares: 7, priceRange: [700, 1500] },
  camel: { name: 'Camel', shares: 7, priceRange: [1000, 2000] },
}

// GET all contributions or by animal
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const animalId = searchParams.get('animalId')
    const status = searchParams.get('status')

    const where: Record<string, unknown> = {}
    if (animalId) where.animalId = animalId
    if (status) where.paymentStatus = status

    const contributions = await db.qurbaniContribution.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        member: {
          select: { firstName: true, lastName: true, phone: true }
        }
      }
    })

    // Group by animalId for progress tracking
    const groupedByAnimal = contributions.reduce((acc, c) => {
      const key = c.animalId || 'unassigned'
      if (!acc[key]) {
        acc[key] = {
          animalType: c.animalType,
          totalShares: ANIMAL_TYPES[c.animalType as keyof typeof ANIMAL_TYPES]?.shares || 1,
          shares: [],
          totalAmount: 0,
          paidAmount: 0,
        }
      }
      if (c.shareNumber) {
        acc[key].shares.push({
          number: c.shareNumber,
          donor: c.member ? `${c.member.firstName} ${c.member.lastName}` : c.donorName,
          status: c.paymentStatus,
          amount: c.amount,
        })
      }
      acc[key].totalAmount += c.amount
      if (c.isPaid) acc[key].paidAmount += c.amount
      return acc
    }, {} as Record<string, unknown>)

    return NextResponse.json({
      contributions,
      animals: groupedByAnimal,
      animalTypes: ANIMAL_TYPES,
    })
  } catch (error) {
    console.error('Error fetching qurbani contributions:', error)
    return NextResponse.json({ error: 'Failed to fetch contributions' }, { status: 500 })
  }
}

// POST - Create new contribution
export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Validate animal type and share
    const animalType = ANIMAL_TYPES[data.animalType as keyof typeof ANIMAL_TYPES]
    if (!animalType) {
      return NextResponse.json({ error: 'Invalid animal type' }, { status: 400 })
    }

    // For cow/camel, validate share number
    if (animalType.shares > 1 && data.shareType === 'share') {
      if (!data.shareNumber || data.shareNumber < 1 || data.shareNumber > animalType.shares) {
        return NextResponse.json({ error: `Share number must be between 1 and ${animalType.shares}` }, { status: 400 })
      }
    }

    const contribution = await db.qurbaniContribution.create({
      data: {
        memberId: data.memberId,
        userId: data.userId,
        animalType: data.animalType,
        animalId: data.animalId,
        shareType: data.shareType || 'full',
        shareNumber: data.shareNumber,
        amount: parseFloat(data.amount),
        currency: data.currency || 'USD',
        paymentMethod: data.paymentMethod,
        donorName: data.donorName,
        donorPhone: data.donorPhone,
        notes: data.notes,
        isPaid: data.isPaid || false,
        paymentStatus: data.paymentStatus || 'pending',
      }
    })

    return NextResponse.json({ success: true, contribution })
  } catch (error) {
    console.error('Error creating qurbani contribution:', error)
    return NextResponse.json({ error: 'Failed to create contribution' }, { status: 500 })
  }
}

// PUT - Update payment status
export async function PUT(request: Request) {
  try {
    const { id, paymentStatus, isPaid } = await request.json()

    const contribution = await db.qurbaniContribution.update({
      where: { id },
      data: {
        paymentStatus,
        isPaid: isPaid ?? paymentStatus === 'completed',
        updatedAt: new Date()
      }
    })

    return NextResponse.json({ success: true, contribution })
  } catch (error) {
    console.error('Error updating qurbani contribution:', error)
    return NextResponse.json({ error: 'Failed to update contribution' }, { status: 500 })
  }
}

// DELETE contribution
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Contribution ID required' }, { status: 400 })
    }

    await db.qurbaniContribution.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting qurbani contribution:', error)
    return NextResponse.json({ error: 'Failed to delete contribution' }, { status: 500 })
  }
}
