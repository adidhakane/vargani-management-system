import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const residents = await prisma.resident.findMany({
      orderBy: [
        { buildingNo: 'asc' },
        { flatNo: 'asc' }
      ]
    })

    return NextResponse.json(residents)
  } catch (error) {
    console.error('Error fetching residents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch residents' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { buildingNo, flatNo, name, contactNo } = body

    // Validate required fields
    if (!buildingNo || !flatNo || !name) {
      return NextResponse.json(
        { error: 'Building number, flat number, and name are required' },
        { status: 400 }
      )
    }

    const resident = await prisma.resident.create({
      data: {
        buildingNo,
        flatNo,
        name,
        contactNo: contactNo || null,
      },
    })

    return NextResponse.json(resident, { status: 201 })
  } catch (error) {
    console.error('Error creating resident:', error)
    
    // Handle unique constraint violation
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A resident with this building and flat number already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create resident' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, buildingNo, flatNo, name, contactNo } = body

    // Validate required fields
    if (!id || !buildingNo || !flatNo || !name) {
      return NextResponse.json(
        { error: 'ID, building number, flat number, and name are required' },
        { status: 400 }
      )
    }

    const resident = await prisma.resident.update({
      where: { id: parseInt(id) },
      data: {
        buildingNo,
        flatNo,
        name,
        contactNo: contactNo || null,
      },
    })

    return NextResponse.json(resident)
  } catch (error) {
    console.error('Error updating resident:', error)
    
    // Handle unique constraint violation
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A resident with this building and flat number already exists' },
        { status: 409 }
      )
    }

    // Handle record not found
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Resident not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update resident' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Resident ID is required' },
        { status: 400 }
      )
    }

    await prisma.resident.delete({
      where: { id: parseInt(id) },
    })

    return NextResponse.json({ message: 'Resident deleted successfully' })
  } catch (error) {
    console.error('Error deleting resident:', error)
    
    // Handle record not found
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Resident not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete resident' },
      { status: 500 }
    )
  }
}
