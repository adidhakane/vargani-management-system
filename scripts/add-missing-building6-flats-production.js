// Script to add missing flat numbers for Building 6 to PRODUCTION database
// Following the same pattern as migrate-local-to-prod.js

const { PrismaClient } = require('@prisma/client');

// Create Prisma client for production database (same URL as in migrate-local-to-prod.js)
const prodPrisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgres://332f47815344c8efa7977b54aa4299d5d5ec5e3a1f06ff5462c4ae133cf93da3:sk_vchL9x8XFu00548S03N59@db.prisma.io:5432/?sslmode=require"
    }
  }
});

// Current Building 6 flats that exist (with names)
const existingFlats = [
  "7", "8", "9", "10", "11", "12", "19", "20", "21", "22", "23", "24", 
  "31", "32", "33", "34", "35", "36", "43", "44", "45", "46", "47", "48"
];

// Generate all possible flat numbers for Building 6 (assuming 1-48 like other buildings)
const allPossibleFlats = [];
for (let i = 1; i <= 48; i++) {
  allPossibleFlats.push(i.toString());
}

// Find missing flat numbers
const missingFlats = allPossibleFlats.filter(flat => !existingFlats.includes(flat));

async function addMissingFlatsToProduction() {
  try {
    console.log('🚀 Adding missing flat numbers for Building 6 to PRODUCTION database...');
    console.log(`📊 Found ${missingFlats.length} missing flat numbers:`, missingFlats);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const flatNo of missingFlats) {
      try {
        // Use upsert to handle any potential duplicates gracefully
        await prodPrisma.resident.upsert({
          where: {
            buildingNo_flatNo: {
              buildingNo: "6",
              flatNo: flatNo,
            },
          },
          update: {
            name: "", // Keep empty for manual entry
          },
          create: {
            buildingNo: "6",
            flatNo: flatNo,
            name: "", // Empty name - to be filled manually later
          },
        });
        successCount++;
        console.log(`   ✅ Added: Building 6, Flat ${flatNo} (empty name)`);
      } catch (error) {
        errorCount++;
        console.error(`   ❌ Error adding Building 6, Flat ${flatNo}:`, error.message);
      }
    }

    console.log('\n📊 Production Database Update Summary:');
    console.log(`   ✅ Successfully added/updated: ${successCount} empty flats`);
    console.log(`   ❌ Errors: ${errorCount} flats`);
    
    // Verify Building 6 count
    const building6Count = await prodPrisma.resident.count({ where: { buildingNo: "6" } });
    const totalCount = await prodPrisma.resident.count();
    
    console.log(`   🏢 Total Building 6 residents: ${building6Count}`);
    console.log(`   🏗️  Total residents in PRODUCTION database: ${totalCount}`);

    console.log('\n🎉 Production database updated successfully!');
    console.log('🌐 Missing flats now available on: https://vargani-management-system.vercel.app');

  } catch (error) {
    console.error('❌ Error adding missing flats to production:', error);
  } finally {
    await prodPrisma.$disconnect();
    console.log('\n🔒 Database connection closed.');
  }
}

// Run the script
if (require.main === module) {
  addMissingFlatsToProduction()
    .then(() => {
      console.log('\n🎉 Production update completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Production update failed:', error);
      process.exit(1);
    });
}

module.exports = { addMissingFlatsToProduction, missingFlats };
