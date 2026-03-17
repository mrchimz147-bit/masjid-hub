import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET all members
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const isVolunteer = searchParams.get('volunteer')
    const isVulnerable = searchParams.get('vulnerable')

    const where: Record<string, unknown> = {}
    if (isVolunteer === 'true') where.isVolunteer = true
    if (isVulnerable === 'true') where.isVulnerable = true

    const members = await db.member.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { email: true, name: true, role: true }
        }
      }
    })

    return NextResponse.json(members)
  } catch (error) {
    console.error('Error fetching members:', error)
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 })
  }
}

// POST - Create new member
export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const member = await db.member.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        province: data.province,
        country: data.country || 'Zimbabwe',
        postalCode: data.postalCode,
        latitude: data.latitude ? parseFloat(data.latitude) : null,
        longitude: data.longitude ? parseFloat(data.longitude) : null,
        isVolunteer: data.isVolunteer || false,
        isVulnerable: data.isVulnerable || false,
        emergencyContact: data.emergencyContact,
        emergencyPhone: data.emergencyPhone,
        occupation: data.occupation,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        notes: data.notes,
      }
    })

    return NextResponse.json({ success: true, member })
  } catch (error) {
    console.error('Error creating member:', error)
    return NextResponse.json({ error: 'Failed to create member' }, { status: 500 })
  }
}

// PUT - Update member
export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const { id, ...updateData } = data

    const member = await db.member.update({
      where: { id },
      data: {
        ...updateData,
        latitude: updateData.latitude ? parseFloat(updateData.latitude) : null,
        longitude: updateData.longitude ? parseFloat(updateData.longitude) : null,
        dateOfBirth: updateData.dateOfBirth ? new Date(updateData.dateOfBirth) : null,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({ success: true, member })
  } catch (error) {
    console.error('Error updating member:', error)
    return NextResponse.json({ error: 'Failed to update member' }, { status: 500 })
  }
}

// DELETE member
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Member ID required' }, { status: 400 })
    }

    await db.member.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting member:', error)
    return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 })
  }
}
