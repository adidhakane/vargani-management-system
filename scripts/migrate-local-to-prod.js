const { PrismaClient } = require('@prisma/client')

// Create two Prisma clients - one for local, one for production
const localPrisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:admin123@localhost:5432/vargani_db"
    }
  }
})

const prodPrisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgres://332f47815344c8efa7977b54aa4299d5d5ec5e3a1f06ff5462c4ae133cf93da3:sk_vchL9x8XFu00548S03N59@db.prisma.io:5432/?sslmode=require"
    }
  }
})

async function migrateData() {
  try {
    console.log('🚀 Starting data migration from local to production...')

    // Step 1: Export residents from local database
    console.log('📤 Exporting residents from local database...')
    const localResidents = await localPrisma.resident.findMany({
      orderBy: [{ buildingNo: 'asc' }, { flatNo: 'asc' }]
    })
    console.log(`   Found ${localResidents.length} residents`)

    // Step 2: Export receipts from local database
    console.log('📤 Exporting receipts from local database...')
    const localReceipts = await localPrisma.receipt.findMany({
      orderBy: [{ buildingNo: 'asc' }, { flatNo: 'asc' }]
    })
    console.log(`   Found ${localReceipts.length} receipts`)

    // Step 3: Import residents to production database
    console.log('📥 Importing residents to production database...')
    for (const resident of localResidents) {
      await prodPrisma.resident.upsert({
        where: {
          buildingNo_flatNo: {
            buildingNo: resident.buildingNo,
            flatNo: resident.flatNo,
          },
        },
        update: {
          name: resident.name,
          contactNo: resident.contactNo,
        },
        create: {
          buildingNo: resident.buildingNo,
          flatNo: resident.flatNo,
          name: resident.name,
          contactNo: resident.contactNo,
        },
      })
    }
    console.log(`   ✅ Imported ${localResidents.length} residents`)

    // Step 4: Import receipts to production database
    console.log('📥 Importing receipts to production database...')
    for (const receipt of localReceipts) {
      try {
        await prodPrisma.receipt.create({
          data: {
            buildingNo: receipt.buildingNo,
            flatNo: receipt.flatNo,
            amount: receipt.amount,
            name: receipt.name,
            contactNo: receipt.contactNo,
            dateTime: receipt.dateTime,
            paymentMode: receipt.paymentMode || 'cash',
          },
        })
      } catch (error) {
        console.warn(`   ⚠️  Skipping duplicate receipt: Building ${receipt.buildingNo}, Flat ${receipt.flatNo}`)
      }
    }
    console.log(`   ✅ Imported receipts`)

    // Step 5: Verify migration
    console.log('🔍 Verifying migration...')
    const prodResidents = await prodPrisma.resident.findMany()
    const prodReceipts = await prodPrisma.receipt.findMany()
    
    console.log(`   Production database now has:`)
    console.log(`   📦 ${prodResidents.length} residents`)
    console.log(`   🧾 ${prodReceipts.length} receipts`)

    // Summary by building
    const building2Receipts = prodReceipts.filter(r => r.buildingNo === '2')
    const building3Receipts = prodReceipts.filter(r => r.buildingNo === '3')
    const building2Total = building2Receipts.reduce((sum, r) => sum + Number(r.amount), 0)
    const building3Total = building3Receipts.reduce((sum, r) => sum + Number(r.amount), 0)

    console.log('\n📊 Production Database Summary:')
    console.log(`   Building 2: ${building2Receipts.length} receipts, Total: ₹${building2Total}`)
    console.log(`   Building 3: ${building3Receipts.length} receipts, Total: ₹${building3Total}`)
    console.log(`   Grand Total: ₹${building2Total + building3Total}`)

    console.log('\n🎉 Migration completed successfully!')
    console.log('🌐 Your data is now available on production: https://vargani-management-system-ad.vercel.app')

  } catch (error) {
    console.error('❌ Error during migration:', error)
  } finally {
    await localPrisma.$disconnect()
    await prodPrisma.$disconnect()
  }
}

migrateData()
