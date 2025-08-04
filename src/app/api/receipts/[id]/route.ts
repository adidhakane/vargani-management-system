import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const receiptId = parseInt(id)
    const { amount, name, paymentMode } = await request.json()

    const updatedReceipt = await prisma.receipt.update({
      where: { id: receiptId },
      data: {
        amount: parseFloat(amount),
        name,
        paymentMode,
      },
    })

    return NextResponse.json(updatedReceipt)
  } catch (error) {
    console.error('Error updating receipt:', error)
    return NextResponse.json(
      { error: 'Failed to update receipt' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const receiptId = parseInt(id)

    await prisma.receipt.delete({
      where: { id: receiptId },
    })

    return NextResponse.json({ message: 'Receipt deleted successfully' })
  } catch (error) {
    console.error('Error deleting receipt:', error)
    return NextResponse.json(
      { error: 'Failed to delete receipt' },
      { status: 500 }
    )
  }
}
