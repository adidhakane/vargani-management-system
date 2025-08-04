import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // Security check - only allow in development or with special key
    const { searchParams } = new URL(request.url)
    const adminKey = searchParams.get('key')
    
    if (process.env.NODE_ENV === 'production' && adminKey !== 'create-first-admin-2025') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const adminEmail = 'admin@vargani.com'
    const adminPassword = 'admin123'
    const adminName = 'System Administrator'

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    })

    if (existingAdmin) {
      return NextResponse.json(
        { message: 'Admin user already exists!' },
        { status: 200 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 12)

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
      },
    })

    return NextResponse.json({
      message: 'Admin user created successfully!',
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      },
      credentials: {
        email: adminEmail,
        password: adminPassword,
        note: 'Please change the password after first login!'
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating admin user:', error)
    return NextResponse.json(
      { error: 'Failed to create admin user', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
