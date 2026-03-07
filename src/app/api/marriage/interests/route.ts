import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Get interests (sent or received)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const profileId = searchParams.get('profileId')
    const type = searchParams.get('type') // 'sent' or 'received'

    if (!profileId) {
      return NextResponse.json({ success: false, error: 'Profile ID required' }, { status: 400 })
    }

    let interests
    if (type === 'sent') {
      interests = await db.marriageInterest.findMany({
        where: { senderProfileId: profileId },
        include: {
          receiverProfile: {
            include: {
              photos: {
                where: { isApproved: true, isPublic: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    } else {
      interests = await db.marriageInterest.findMany({
        where: { receiverProfileId: profileId },
        include: {
          senderProfile: {
            include: {
              photos: {
                where: { isApproved: true, isPublic: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    }

    return NextResponse.json({ success: true, interests })
  } catch (error) {
    console.error('Error fetching interests:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch interests' }, { status: 500 })
  }
}

// POST - Send interest
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { senderProfileId, receiverProfileId, message } = body

    if (!senderProfileId || !receiverProfileId) {
      return NextResponse.json({ success: false, error: 'Both profile IDs required' }, { status: 400 })
    }

    // Check if interest already exists
    const existing = await db.marriageInterest.findUnique({
      where: {
        senderProfileId_receiverProfileId: {
          senderProfileId,
          receiverProfileId
        }
      }
    })

    if (existing) {
      return NextResponse.json({ 
        success: false, 
        error: 'Interest already sent to this profile',
        existing: true
      }, { status: 400 })
    }

    const interest = await db.marriageInterest.create({
      data: {
        senderProfileId,
        receiverProfileId,
        message
      }
    })

    return NextResponse.json({ success: true, interest })
  } catch (error) {
    console.error('Error creating interest:', error)
    return NextResponse.json({ success: false, error: 'Failed to send interest' }, { status: 500 })
  }
}

// PUT - Respond to interest (accept/decline)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status } = body // status: 'accepted', 'declined', 'blocked'

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'ID and status required' }, { status: 400 })
    }

    const interest = await db.marriageInterest.update({
      where: { id },
      data: {
        status,
        respondedAt: new Date()
      }
    })

    return NextResponse.json({ success: true, interest })
  } catch (error) {
    console.error('Error updating interest:', error)
    return NextResponse.json({ success: false, error: 'Failed to update interest' }, { status: 500 })
  }
}
