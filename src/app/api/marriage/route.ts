import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - List marriage profiles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const gender = searchParams.get('gender')
    const minAge = searchParams.get('minAge')
    const maxAge = searchParams.get('maxAge')
    const admin = searchParams.get('admin')
    const memberId = searchParams.get('memberId')

    // If memberId provided, get that specific profile
    if (memberId) {
      const profile = await db.marriageProfile.findUnique({
        where: { memberId },
        include: {
          photos: {
            where: { isApproved: true },
            orderBy: { order: 'asc' }
          }
        }
      })
      return NextResponse.json({ success: true, profile })
    }

    // Build filter
    const where: any = {}
    
    if (admin !== 'true') {
      where.isApproved = true
      where.isActive = true
      where.isVisible = true
    }
    
    if (gender) {
      where.gender = gender
    }
    
    if (minAge || maxAge) {
      where.age = {}
      if (minAge) where.age.gte = parseInt(minAge)
      if (maxAge) where.age.lte = parseInt(maxAge)
    }

    const profiles = await db.marriageProfile.findMany({
      where,
      include: {
        photos: {
          where: admin === 'true' ? {} : { isApproved: true, isPublic: true },
          orderBy: { order: 'asc' }
        },
        member: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: { lastActiveAt: 'desc' }
    })

    return NextResponse.json({ success: true, profiles })
  } catch (error) {
    console.error('Error fetching marriage profiles:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch profiles' }, { status: 500 })
  }
}

// POST - Create or update marriage profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      memberId,
      displayName,
      gender,
      age,
      maritalStatus,
      occupation,
      education,
      nationality,
      height,
      religiousPractice,
      prayerFrequency,
      hijab,
      beard,
      islamicEducation,
      aboutMe,
      aboutFamily,
      lookingFor,
      ageMin,
      ageMax,
      preferredEducation,
      preferredLocation,
      preferredBackground,
      preferredNationality,
      relocation,
      contactEmail,
      contactPhone,
      waliName,
      waliPhone,
      waliEmail,
      showPhotos,
      allowContact
    } = body

    if (!memberId || !displayName || !gender || !age || !maritalStatus) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 })
    }

    // Check if profile already exists
    const existingProfile = await db.marriageProfile.findUnique({
      where: { memberId }
    })

    if (existingProfile) {
      // Update existing profile
      const profile = await db.marriageProfile.update({
        where: { memberId },
        data: {
          displayName,
          gender,
          age: parseInt(age),
          maritalStatus,
          occupation,
          education,
          nationality,
          height,
          religiousPractice,
          prayerFrequency,
          hijab,
          beard,
          islamicEducation,
          aboutMe,
          aboutFamily,
          lookingFor,
          ageMin: ageMin ? parseInt(ageMin) : null,
          ageMax: ageMax ? parseInt(ageMax) : null,
          preferredEducation,
          preferredLocation,
          preferredBackground,
          preferredNationality,
          relocation,
          contactEmail,
          contactPhone,
          waliName,
          waliPhone,
          waliEmail,
          showPhotos: showPhotos ?? true,
          allowContact: allowContact ?? false,
          lastActiveAt: new Date()
        }
      })
      return NextResponse.json({ success: true, profile })
    }

    // Create new profile
    const profile = await db.marriageProfile.create({
      data: {
        memberId,
        displayName,
        gender,
        age: parseInt(age),
        maritalStatus,
        occupation,
        education,
        nationality,
        height,
        religiousPractice,
        prayerFrequency,
        hijab,
        beard,
        islamicEducation,
        aboutMe,
        aboutFamily,
        lookingFor,
        ageMin: ageMin ? parseInt(ageMin) : null,
        ageMax: ageMax ? parseInt(ageMax) : null,
        preferredEducation,
        preferredLocation,
        preferredBackground,
        preferredNationality,
        relocation,
        contactEmail,
        contactPhone,
        waliName,
        waliPhone,
        waliEmail,
        showPhotos: showPhotos ?? true,
        allowContact: allowContact ?? false
      }
    })

    return NextResponse.json({ success: true, profile })
  } catch (error) {
    console.error('Error creating/updating marriage profile:', error)
    return NextResponse.json({ success: false, error: 'Failed to save profile' }, { status: 500 })
  }
}

// PUT - Admin approve/profile update
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, isApproved, isVerified, isVisible, adminNotes, reviewedBy } = body

    const profile = await db.marriageProfile.update({
      where: { id },
      data: {
        isApproved,
        isVerified,
        isVisible,
        adminNotes,
        reviewedBy,
        reviewedAt: new Date()
      }
    })

    return NextResponse.json({ success: true, profile })
  } catch (error) {
    console.error('Error updating marriage profile:', error)
    return NextResponse.json({ success: false, error: 'Failed to update profile' }, { status: 500 })
  }
}

// DELETE - Remove profile
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 })
    }

    await db.marriageProfile.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting marriage profile:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete profile' }, { status: 500 })
  }
}
