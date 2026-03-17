import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Fetch approved photos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const admin = searchParams.get('admin')
    const category = searchParams.get('category')
    
    const photos = await db.photo.findMany({
      where: admin ? {} : { 
        isApproved: true,
        ...(category && { category })
      },
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ]
    })
    
    return NextResponse.json({ success: true, photos })
  } catch (error) {
    console.error('Error fetching photos:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch photos' }, { status: 500 })
  }
}

// POST - Upload a new photo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, imageUrl, thumbnailUrl, category, event, uploadedBy, uploaderName } = body
    
    if (!title || !imageUrl || !uploadedBy) {
      return NextResponse.json({ success: false, error: 'Title, image, and uploader ID are required' }, { status: 400 })
    }
    
    const photo = await db.photo.create({
      data: {
        title,
        description: description || null,
        imageUrl,
        thumbnailUrl: thumbnailUrl || null,
        category: category || 'general',
        event: event || null,
        uploadedBy,
        uploaderName: uploaderName || null,
        isApproved: false,
        isFeatured: false
      }
    })
    
    return NextResponse.json({ success: true, photo })
  } catch (error) {
    console.error('Error creating photo:', error)
    return NextResponse.json({ success: false, error: 'Failed to upload photo' }, { status: 500 })
  }
}

// PUT - Admin approve/feature photo
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, isApproved, isFeatured, approvedBy } = body
    
    const photo = await db.photo.update({
      where: { id },
      data: {
        isApproved,
        isFeatured,
        approvedBy,
        approvedAt: isApproved ? new Date() : null
      }
    })
    
    return NextResponse.json({ success: true, photo })
  } catch (error) {
    console.error('Error updating photo:', error)
    return NextResponse.json({ success: false, error: 'Failed to update photo' }, { status: 500 })
  }
}

// DELETE - Remove photo
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 })
    }
    
    await db.photo.delete({ where: { id } })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting photo:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete photo' }, { status: 500 })
  }
}
