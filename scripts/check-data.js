const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkData() {
  try {
    console.log('🔍 Checking current database data...\n')

    // Check residents
    const residents = await prisma.resident.findMany({
      orderBy: [{ buildingNo: 'asc' }, { flatNo: 'asc' }]
    })
    console.log(`📦 Residents found: ${residents.length}`)
    residents.forEach(r => {
      console.log(`   Building ${r.buildingNo}, Flat ${r.flatNo}: ${r.name}`)
    })

    console.log('')

    // Check receipts
    const receipts = await prisma.receipt.findMany({
      orderBy: [{ dateTime: 'desc' }]
    })
    console.log(`🧾 Receipts found: ${receipts.length}`)
    receipts.forEach(r => {
      console.log(`   ${r.dateTime.toDateString()} - Building ${r.buildingNo}, Flat ${r.flatNo}: ₹${r.amount} (${r.paymentMode})`)
    })

    // Summary by building
    console.log('\n📊 Summary by Building:')
    const summary = await prisma.receipt.groupBy({
      by: ['buildingNo'],
      _sum: { amount: true },
      _count: { id: true }
    })
    
    summary.forEach(s => {
      console.log(`   Building ${s.buildingNo}: ${s._count.id} receipts, Total: ₹${s._sum.amount}`)
    })

  } catch (error) {
    console.error('❌ Error checking data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkData()
