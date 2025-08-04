const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const sampleResidents = [
  { buildingNo: '1', flatNo: '101', name: 'John Doe', contactNo: '9876543210' },
  { buildingNo: '1', flatNo: '102', name: 'Jane Smith', contactNo: '9876543211' },
  { buildingNo: '1', flatNo: '103', name: 'Bob Wilson', contactNo: '9876543212' },
  { buildingNo: '2', flatNo: '201', name: 'Alice Brown', contactNo: '9876543213' },
  { buildingNo: '2', flatNo: '202', name: 'Charlie Davis', contactNo: '9876543214' },
  { buildingNo: '3', flatNo: '301', name: 'Diana Miller', contactNo: '9876543215' },
  { buildingNo: '3', flatNo: '302', name: 'Eve Johnson', contactNo: '9876543216' },
]

const sampleReceipts = [
  { buildingNo: '1', flatNo: '101', amount: 1500, paymentMode: 'cash', dateTime: new Date('2025-01-15') },
  { buildingNo: '1', flatNo: '102', amount: 1200, paymentMode: 'online', dateTime: new Date('2025-01-16') },
  { buildingNo: '1', flatNo: '103', amount: 1800, paymentMode: 'cash', dateTime: new Date('2025-01-17') },
  { buildingNo: '2', flatNo: '201', amount: 2000, paymentMode: 'online', dateTime: new Date('2025-01-18') },
  { buildingNo: '2', flatNo: '202', amount: 1600, paymentMode: 'cash', dateTime: new Date('2025-01-19') },
  { buildingNo: '3', flatNo: '301', amount: 1400, paymentMode: 'online', dateTime: new Date('2025-01-20') },
  { buildingNo: '3', flatNo: '302', amount: 1750, paymentMode: 'cash', dateTime: new Date('2025-01-21') },
  { buildingNo: '1', flatNo: '101', amount: 1500, paymentMode: 'online', dateTime: new Date('2025-02-15') },
  { buildingNo: '1', flatNo: '102', amount: 1200, paymentMode: 'cash', dateTime: new Date('2025-02-16') },
  { buildingNo: '2', flatNo: '201', amount: 2000, paymentMode: 'online', dateTime: new Date('2025-02-17') },
]

async function seedSampleData() {
  try {
    console.log('🌱 Seeding sample data...')

    // Create residents
    console.log('📦 Creating residents...')
    for (const resident of sampleResidents) {
      await prisma.resident.upsert({
        where: {
          buildingNo_flatNo: {
            buildingNo: resident.buildingNo,
            flatNo: resident.flatNo,
          },
        },
        update: {},
        create: resident,
      })
    }
    console.log(`✅ Created ${sampleResidents.length} residents`)

    // Create receipts
    console.log('🧾 Creating receipts...')
    for (const receipt of sampleReceipts) {
      const resident = sampleResidents.find(
        r => r.buildingNo === receipt.buildingNo && r.flatNo === receipt.flatNo
      )
      
      await prisma.receipt.create({
        data: {
          ...receipt,
          name: resident?.name || null,
          contactNo: resident?.contactNo || null,
        },
      })
    }
    console.log(`✅ Created ${sampleReceipts.length} receipts`)

    console.log('🎉 Sample data seeded successfully!')
    console.log('📊 Your dashboard should now show data!')
  } catch (error) {
    console.error('❌ Error seeding sample data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedSampleData()
