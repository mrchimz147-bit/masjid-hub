import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hash, compare } from 'bcryptjs'

// Demo users - in production, these would be in the database
const DEMO_USERS = [
  {
    id: 'imam-001',
    email: 'imam@zeenatulislam.org',
    password: 'imam2024',
    name: 'Imam',
    role: 'ADMIN',
  },
  {
    id: 'tech-001',
    email: 'tech@zeenatulislam.org',
    password: 'tech2024',
    name: 'Tech Support',
    role: 'ADMIN',
  },
  {
    id: 'chairman-001',
    email: 'chairman@zeenatulislam.org',
    password: 'chairman2024',
    name: 'Chairman',
    role: 'ADMIN',
  },
  {
    id: 'treasurer-001',
    email: 'treasurer@zeenatulislam.org',
    password: 'treasurer2024',
    name: 'Treasurer',
    role: 'ADMIN',
  },
  {
    id: 'secretary-001',
    email: 'secretary@zeenatulislam.org',
    password: 'secretary2024',
    name: 'Secretary',
    role: 'MODERATOR',
  },
]

export async function POST(request: Request) {
  try {
    const { email, password, action } = await request.json()

    // Login action
    if (action === 'login') {
      // Check demo users first
      const demoUser = DEMO_USERS.find(u => u.email === email)
      
      if (demoUser && demoUser.password === password) {
        return NextResponse.json({
          success: true,
          user: {
            id: demoUser.id,
            email: demoUser.email,
            name: demoUser.name,
            role: demoUser.role,
          }
        })
      }

      // Check database users
      try {
        const dbUser = await db.user.findUnique({
          where: { email }
        })

        if (dbUser && dbUser.passwordHash) {
          const isValid = await compare(password, dbUser.passwordHash)
          if (isValid) {
            return NextResponse.json({
              success: true,
              user: {
                id: dbUser.id,
                email: dbUser.email,
                name: dbUser.name,
                role: dbUser.role,
              }
            })
          }
        }
      } catch (dbError) {
        console.log('Database check failed, using demo users')
      }

      return NextResponse.json({
        success: false,
        error: 'Invalid email or password'
      }, { status: 401 })
    }

    // Create new user (for admin to add more users)
    if (action === 'create') {
      const { name, role } = await request.json()
      
      const hashedPassword = await hash(password, 10)
      
      try {
        const newUser = await db.user.create({
          data: {
            email,
            name,
            passwordHash: hashedPassword,
            role: role || 'MEMBER',
          }
        })

        return NextResponse.json({
          success: true,
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
          }
        })
      } catch {
        return NextResponse.json({
          success: false,
          error: 'Email already exists'
        }, { status: 400 })
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// Get all users (admin only)
export async function GET() {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      }
    })

    // Include demo users
    const allUsers = [
      ...DEMO_USERS.map(u => ({
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        createdAt: new Date().toISOString(),
        isDemo: true,
      })),
      ...users.map(u => ({
        ...u,
        isDemo: false,
      })),
    ]

    return NextResponse.json(allUsers)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}
