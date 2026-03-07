import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Get photos for a profile
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const profileId = searchParams.get('profileId')
    const admin = searchParams.get('admin')

    if (!profileId) {
      return NextResponse.json({ success: false, error: 'Profile ID required' }, { status: 400 })
    }

    const photos = await db.marriagePhoto.findMany({
      where: {
        profileId,
        ...(admin !== 'true' && { isApproved: true })
      },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({ success: true, photos })
  } catch (error) {
    console.error('Error fetching photos:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch photos' }, { status: 500 })
  }
}

// POST - Upload photo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { profileId, imageUrl, isPublic, isProfilePhoto } = body

    if (!profileId || !imageUrl) {
      return NextResponse.json({ success: false, error: 'Profile ID and image URL required' }, { status: 400 })
    }

    // Get current photo count for ordering
    const existingPhotos = await db.marriagePhoto.count({
      where: { profileId }
    })

    const photo = await db.marriagePhoto.create({
      data: {
        profileId,
        imageUrl,
        isPublic: isPublic ?? false,
        isProfilePhoto: isProfilePhoto ?? false,
        order: existingPhotos
      }
    })

    return NextResponse.json({ success: true, photo })
  } catch (error) {
    console.error('Error uploading photo:', error)
    return NextResponse.json({ success: false, error: 'Failed to upload photo' }, { status: 500 })
  }
}

// PUT - Update photo settings (admin approve, change visibility)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, isPublic, isApproved, isProfilePhoto } = body

    const photo = await db.marriagePhoto.update({
      where: { id },
      data: {
        isPublic,
        isApproved,
        isProfilePhoto
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

    await db.marriagePhoto.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting photo:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete photo' }, { status: 500 })
  }
}
