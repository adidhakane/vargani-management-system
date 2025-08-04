import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const buildingNo = searchParams.get('buildingNo')
    const date = searchParams.get('date')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const whereClause: Record<string, string | number | { gte?: Date; lte?: Date }> = {}

    if (buildingNo) {
      whereClause.buildingNo = buildingNo
    }

    if (date) {
      // Filter by specific date
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      whereClause.dateTime = {
        gte: startOfDay,
        lte: endOfDay,
      }
    } else if (startDate && endDate) {
      // Filter by date range
      whereClause.dateTime = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }

    const receipts = await prisma.receipt.findMany({
      where: whereClause,
      include: {
        resident: true,
      },
    })

    // Sort receipts by building number and then flat number (numerically)
    const sortedReceipts = receipts.sort((a, b) => {
      const buildingCompare = a.buildingNo.localeCompare(b.buildingNo)
      if (buildingCompare !== 0) return buildingCompare
      return parseInt(a.flatNo) - parseInt(b.flatNo)
    })

    return NextResponse.json(sortedReceipts)
  } catch (error) {
    console.error('Error fetching receipts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch receipts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { buildingNo, flatNo, amount, name, contactNo, dateTime, paymentMode } = body

    // Validate required fields
    if (!buildingNo || !flatNo || !amount || !dateTime) {
      return NextResponse.json(
        { error: 'Building number, flat number, amount, and date/time are required' },
        { status: 400 }
      )
    }

    // Validate amount is a positive number
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number' },
        { status: 400 }
      )
    }

    // Validate payment mode
    if (paymentMode && !['cash', 'online'].includes(paymentMode)) {
      return NextResponse.json(
        { error: 'Payment mode must be either "cash" or "online"' },
        { status: 400 }
      )
    }

    // Check if resident exists, if not create with provided name
    let resident = await prisma.resident.findUnique({
      where: {
        buildingNo_flatNo: {
          buildingNo,
          flatNo,
        },
      },
    })

    if (!resident && name) {
      // Create resident if it doesn't exist and name is provided
      resident = await prisma.resident.create({
        data: {
          buildingNo,
          flatNo,
          name,
          contactNo: contactNo || null,
        },
      })
    }

    const receipt = await prisma.receipt.create({
      data: {
        buildingNo,
        flatNo,
        amount,
        name: name || resident?.name || null,
        contactNo: contactNo || resident?.contactNo || null,
        dateTime: new Date(dateTime),
        paymentMode: paymentMode || 'cash',
      },
      include: {
        resident: true,
      },
    })

    return NextResponse.json(receipt, { status: 201 })
  } catch (error) {
    console.error('Error creating receipt:', error)
    return NextResponse.json(
      { error: 'Failed to create receipt' },
      { status: 500 }
    )
  }
}
