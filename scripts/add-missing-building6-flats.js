// Script to add missing flat numbers for Building 6 (with empty names for manual entry later)
// This will add flats that are missing so they appear in the dropdown for receipt generation

const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();

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

async function addMissingFlats() {
  try {
    console.log('🏢 Adding missing flat numbers for Building 6...');
    console.log(`📊 Found ${missingFlats.length} missing flat numbers:`, missingFlats);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const flatNo of missingFlats) {
      try {
        await prisma.resident.create({
          data: {
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

    console.log('\n📊 Local Database Update Summary:');
    console.log(`   ✅ Successfully added: ${successCount} empty flats`);
    console.log(`   ❌ Errors: ${errorCount} flats`);
    
    // Verify Building 6 count
    const building6Count = await prisma.resident.count({ where: { buildingNo: "6" } });
    console.log(`   🏢 Total Building 6 residents: ${building6Count}`);

  } catch (error) {
    console.error('❌ Error adding missing flats:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
if (require.main === module) {
  addMissingFlats()
    .then(() => {
      console.log('\n🎉 Missing flats added successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Failed to add missing flats:', error);
      process.exit(1);
    });
}

module.exports = { addMissingFlats, missingFlats };
