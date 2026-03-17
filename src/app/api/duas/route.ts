import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const where = category ? { category } : {}

    const duas = await db.dua.findMany({
      where,
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(duas)
  } catch (error) {
    console.error('Error fetching duas:', error)
    return NextResponse.json({ error: 'Failed to fetch duas' }, { status: 500 })
  }
}
