import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

// GET - Get current member from token
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: 'No token provided' 
      }, { status: 401 })
    }

    const session = await db.memberSession.findUnique({
      where: { token },
      include: {
        member: {
          include: {
            marriageProfile: {
              include: {
                photos: true
              }
            }
          }
        }
      }
    })

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ 
        success: false, 
        error: 'Session expired. Please login again.' 
      }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      member: {
        id: session.member.id,
        firstName: session.member.firstName,
        lastName: session.member.lastName,
        email: session.member.email,
        phone: session.member.phone,
        city: session.member.city,
        marriageProfile: session.member.marriageProfile
      }
    })
  } catch (error) {
    console.error('Session validation error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Session validation failed' 
    }, { status: 500 })
  }
}

// POST - Login, Register, Logout
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, email, password, firstName, lastName, phone, token } = body

    // Register new member
    if (action === 'register') {
      if (!email || !password || !firstName || !lastName) {
        return NextResponse.json({ 
          success: false, 
          error: 'Email, password, first name, and last name are required' 
        }, { status: 400 })
      }

      // Check if email already exists
      const existingMember = await db.member.findUnique({
        where: { email }
      })

      if (existingMember) {
        return NextResponse.json({ 
          success: false, 
          error: 'An account with this email already exists' 
        }, { status: 400 })
      }

      // Create member
      const hashedPassword = await bcrypt.hash(password, 10)
      
      const member = await db.member.create({
        data: {
          firstName,
          lastName,
          email,
          phone: phone || null,
          passwordHash: hashedPassword,
          city: 'Bulawayo',
          country: 'Zimbabwe'
        }
      })

      // Create session token
      const sessionToken = crypto.randomUUID()
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

      await db.memberSession.create({
        data: {
          memberId: member.id,
          token: sessionToken,
          expiresAt
        }
      })

      return NextResponse.json({
        success: true,
        member: {
          id: member.id,
          firstName: member.firstName,
          lastName: member.lastName,
          email: member.email
        },
        token: sessionToken
      })
    }

    // Login existing member
    if (action === 'login') {
      if (!email || !password) {
        return NextResponse.json({ 
          success: false, 
          error: 'Email and password are required' 
        }, { status: 400 })
      }

      const member = await db.member.findUnique({
        where: { email },
        include: {
          marriageProfile: {
            include: {
              photos: true
            }
          }
        }
      })

      if (!member || !member.passwordHash) {
        return NextResponse.json({ 
          success: false, 
          error: 'Invalid email or password' 
        }, { status: 401 })
      }

      const validPassword = await bcrypt.compare(password, member.passwordHash)
      
      if (!validPassword) {
        return NextResponse.json({ 
          success: false, 
          error: 'Invalid email or password' 
        }, { status: 401 })
      }

      // Create session token
      const sessionToken = crypto.randomUUID()
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

      await db.memberSession.create({
        data: {
          memberId: member.id,
          token: sessionToken,
          expiresAt
        }
      })

      // Update last login
      await db.member.update({
        where: { id: member.id },
        data: { lastLoginAt: new Date() }
      })

      return NextResponse.json({
        success: true,
        member: {
          id: member.id,
          firstName: member.firstName,
          lastName: member.lastName,
          email: member.email,
          phone: member.phone,
          city: member.city,
          marriageProfile: member.marriageProfile
        },
        token: sessionToken
      })
    }

    // Logout
    if (action === 'logout') {
      if (token) {
        try {
          await db.memberSession.delete({
            where: { token }
          })
        } catch {
          // Token might not exist, ignore
        }
      }
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Invalid action' 
    }, { status: 400 })

  } catch (error) {
    console.error('Member auth error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Server error' 
    }, { status: 500 })
  }
}
