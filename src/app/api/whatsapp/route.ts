import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import whatsappService from '@/lib/whatsapp'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || (session.user.role !== 'approved' && session.user.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { phoneNumber, receiptId, contributorName, amount, method = 'url' } = body

    if (!phoneNumber || !receiptId) {
      return NextResponse.json({ 
        error: 'Phone number and receipt ID are required' 
      }, { status: 400 })
    }

    // Validate phone number
    if (!whatsappService.isValidPhoneNumber(phoneNumber)) {
      return NextResponse.json({ 
        error: 'Invalid phone number format' 
      }, { status: 400 })
    }

    let result

    // Choose method: 'url' for free implementation, 'admin' for admin notification
    if (method === 'admin') {
      result = await whatsappService.notifyAdminForManualAddition(
        phoneNumber, 
        contributorName || 'Contributor',
        amount || 0
      )
    } else {
      // Default: generate WhatsApp URL for direct invitation
      result = await whatsappService.sendInviteViaURL(
        phoneNumber, 
        contributorName || 'Contributor',
        amount || 0
      )
    }

    // Log the WhatsApp action
    console.log(`📱 FREE WhatsApp integration for receipt ${receiptId}: ${result.message}`)

    return NextResponse.json({
      success: result.success,
      message: result.message,
      data: result.data,
      whatsappUrl: result.whatsappUrl, // URL to open WhatsApp
      method: method
    })

  } catch (error) {
    console.error('WhatsApp integration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
