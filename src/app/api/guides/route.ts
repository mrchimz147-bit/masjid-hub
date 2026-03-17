import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const where = category ? { category } : {}

    const guides = await db.guideStep.findMany({
      where,
      orderBy: [{ category: 'asc' }, { stepNumber: 'asc' }],
    })

    return NextResponse.json(guides)
  } catch (error) {
    console.error('Error fetching guides:', error)
    return NextResponse.json({ error: 'Failed to fetch guides' }, { status: 500 })
  }
}
