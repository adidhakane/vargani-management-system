const { PrismaClient } = require('@prisma/client')

const prodPrisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgres://332f47815344c8efa7977b54aa4299d5d5ec5e3a1f06ff5462c4ae133cf93da3:sk_vchL9x8XFu00548S03N59@db.prisma.io:5432/?sslmode=require"
    }
  }
})

async function removeDuplicateReceipts() {
  try {
    console.log('🧹 Cleaning up duplicate receipts...')

    // Get all receipts from production
    const allReceipts = await prodPrisma.receipt.findMany({
      orderBy: [{ id: 'asc' }] // Keep the first occurrence
    })
    
    console.log(`   Found ${allReceipts.length} total receipts`)

    // Group receipts by building, flat, amount, and date to identify duplicates
    const receiptGroups = new Map()
    const duplicateIds = []

    allReceipts.forEach(receipt => {
      // Create a unique key for each receipt
      const key = `${receipt.buildingNo}-${receipt.flatNo}-${receipt.amount}-${receipt.dateTime.getTime()}`
      
      if (receiptGroups.has(key)) {
        // This is a duplicate - mark for deletion (keep the first one)
        duplicateIds.push(receipt.id)
      } else {
        // First occurrence - keep it
        receiptGroups.set(key, receipt)
      }
    })

    console.log(`   Found ${duplicateIds.length} duplicate receipts to remove`)

    if (duplicateIds.length > 0) {
      // Delete duplicate receipts
      const deleteResult = await prodPrisma.receipt.deleteMany({
        where: {
          id: {
            in: duplicateIds
          }
        }
      })

      console.log(`   ✅ Deleted ${deleteResult.count} duplicate receipts`)
    } else {
      console.log(`   ✅ No duplicates found`)
    }

    // Verify the cleanup
    console.log('🔍 Verifying cleanup...')
    const remainingReceipts = await prodPrisma.receipt.findMany()
    
    console.log(`   Production database now has:`)
    console.log(`   🧾 ${remainingReceipts.length} receipts (after cleanup)`)

    // Summary by building
    const building2Receipts = remainingReceipts.filter(r => r.buildingNo === '2')
    const building3Receipts = remainingReceipts.filter(r => r.buildingNo === '3')
    const building2Total = building2Receipts.reduce((sum, r) => sum + Number(r.amount), 0)
    const building3Total = building3Receipts.reduce((sum, r) => sum + Number(r.amount), 0)

    console.log('\n📊 Cleaned Production Database Summary:')
    console.log(`   Building 2: ${building2Receipts.length} receipts, Total: ₹${building2Total}`)
    console.log(`   Building 3: ${building3Receipts.length} receipts, Total: ₹${building3Total}`)
    console.log(`   Grand Total: ₹${building2Total + building3Total}`)

    console.log('\n🎉 Duplicate cleanup completed successfully!')
    console.log('🌐 Your production dashboard now shows clean data: https://vargani-management-system-ad.vercel.app')

  } catch (error) {
    console.error('❌ Error during cleanup:', error)
  } finally {
    await prodPrisma.$disconnect()
  }
}

removeDuplicateReceipts()
