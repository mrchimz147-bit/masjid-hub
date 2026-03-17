import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Fetch approved tributes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const admin = searchParams.get('admin')
    
    const tributes = await db.tribute.findMany({
      where: admin ? {} : { isApproved: true },
      orderBy: [
        { isHighlighted: 'desc' },
        { submittedAt: 'desc' }
      ]
    })
    
    return NextResponse.json({ success: true, tributes })
  } catch (error) {
    console.error('Error fetching tributes:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch tributes' }, { status: 500 })
  }
}

// POST - Submit a new tribute
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, relationship, message } = body
    
    if (!name || !message) {
      return NextResponse.json({ success: false, error: 'Name and message are required' }, { status: 400 })
    }
    
    const tribute = await db.tribute.create({
      data: {
        name,
        relationship: relationship || null,
        message,
        isApproved: false,
        isHighlighted: false
      }
    })
    
    return NextResponse.json({ success: true, tribute })
  } catch (error) {
    console.error('Error creating tribute:', error)
    return NextResponse.json({ success: false, error: 'Failed to submit tribute' }, { status: 500 })
  }
}

// PUT - Admin approve/highlight tribute
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, isApproved, isHighlighted, reviewedBy } = body
    
    const tribute = await db.tribute.update({
      where: { id },
      data: {
        isApproved,
        isHighlighted,
        reviewedBy,
        reviewedAt: new Date()
      }
    })
    
    return NextResponse.json({ success: true, tribute })
  } catch (error) {
    console.error('Error updating tribute:', error)
    return NextResponse.json({ success: false, error: 'Failed to update tribute' }, { status: 500 })
  }
}

// DELETE - Remove tribute
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 })
    }
    
    await db.tribute.delete({ where: { id } })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting tribute:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete tribute' }, { status: 500 })
  }
}
