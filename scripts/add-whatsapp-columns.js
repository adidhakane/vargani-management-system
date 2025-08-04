// Manual migration script to add WhatsApp columns to production database
// Run this with: node scripts/add-whatsapp-columns.js

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addWhatsAppColumns() {
  try {
    console.log('🚀 Starting manual migration to add WhatsApp columns...')

    // Check if columns already exist
    const result = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'receipts' 
      AND column_name IN ('add_to_whatsapp', 'whatsapp_status')
    `

    console.log('Existing columns:', result)

    if (result.length === 0) {
      console.log('📝 Adding add_to_whatsapp column...')
      
      // Add the columns
      await prisma.$executeRaw`
        ALTER TABLE "receipts" 
        ADD COLUMN "add_to_whatsapp" BOOLEAN NOT NULL DEFAULT false
      `

      console.log('📝 Adding whatsapp_status column...')
      
      await prisma.$executeRaw`
        ALTER TABLE "receipts" 
        ADD COLUMN "whatsapp_status" TEXT
      `

      console.log('✅ WhatsApp columns added successfully!')
    } else {
      console.log('✅ WhatsApp columns already exist!')
    }

    // Verify the columns were added
    const verification = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'receipts' 
      AND column_name IN ('add_to_whatsapp', 'whatsapp_status')
    `

    console.log('✅ Verification - Current columns:', verification)

  } catch (error) {
    console.error('❌ Error adding WhatsApp columns:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addWhatsAppColumns()
