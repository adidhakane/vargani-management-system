// Script to migrate remaining residents data (Buildings 4, 5, 6, 7) to production database
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

const residentsData = [
  // Building 4
  { buildingNo: "4", flatNo: "1", name: "Satish Hardas" },
  { buildingNo: "4", flatNo: "2", name: "Madhukar Mokate" },
  { buildingNo: "4", flatNo: "3", name: "Shrikrishna Kulkarni" },
  { buildingNo: "4", flatNo: "4", name: "Susmita Khisti" },
  { buildingNo: "4", flatNo: "5", name: "Kamalakar Vispute" },
  { buildingNo: "4", flatNo: "6", name: "Dashrath Mokate" },
  { buildingNo: "4", flatNo: "7", name: "Kisan Mokate" },
  { buildingNo: "4", flatNo: "8", name: "Suhas Angal" },
  { buildingNo: "4", flatNo: "9", name: "Pradip Devsthali" },
  { buildingNo: "4", flatNo: "10", name: "Rajesh Arde" },
  { buildingNo: "4", flatNo: "11", name: "Prabhakar Kanade" },
  { buildingNo: "4", flatNo: "12", name: "Atul Bengeri" },
  { buildingNo: "4", flatNo: "13", name: "Sunita Dhairyawan" },
  { buildingNo: "4", flatNo: "14", name: "Sushant Pawar" },
  { buildingNo: "4", flatNo: "15", name: "Pankaj Phansalkar" },
  { buildingNo: "4", flatNo: "16", name: "Chandrashekhar Khedkar" },
  { buildingNo: "4", flatNo: "17", name: "Kalpana Mokate" },
  { buildingNo: "4", flatNo: "18", name: "Kalpana Mokate" },
  { buildingNo: "4", flatNo: "19", name: "Kishor Dumbre" },
  { buildingNo: "4", flatNo: "20", name: "Sonali Khandekar" },
  { buildingNo: "4", flatNo: "21", name: "Mangala Kothare" },
  { buildingNo: "4", flatNo: "22", name: "Nikhila Dhurandhar" },
  { buildingNo: "4", flatNo: "23", name: "Anant Somani" },
  { buildingNo: "4", flatNo: "24", name: "Milind Pawar" },
  { buildingNo: "4", flatNo: "25", name: "Ganesh Kharkar" },
  { buildingNo: "4", flatNo: "26", name: "Sangita Shirsat" },
  { buildingNo: "4", flatNo: "27", name: "Vivek Moghe" },
  { buildingNo: "4", flatNo: "28", name: "Prakash Patil" },
  { buildingNo: "4", flatNo: "29", name: "Gaurav Ghawalkar" },
  { buildingNo: "4", flatNo: "30", name: "Savita Komkar" },
  { buildingNo: "4", flatNo: "31", name: "Shivaji Gujar" },
  { buildingNo: "4", flatNo: "32", name: "Shri Vijay Manohar Kalokhe" },

  // Building 5
  { buildingNo: "5", flatNo: "1", name: "Gopal Khadilkar" },
  { buildingNo: "5", flatNo: "2", name: "Yajuvendra Bokil" },
  { buildingNo: "5", flatNo: "3", name: "Ashok Visal" },
  { buildingNo: "5", flatNo: "4", name: "Amit Narayan Phadke" },
  { buildingNo: "5", flatNo: "5", name: "Shri Amod Bhatkhalkar" },
  { buildingNo: "5", flatNo: "6", name: "Ashwini Tambe" },
  { buildingNo: "5", flatNo: "7", name: "Sharad Tambe" },
  { buildingNo: "5", flatNo: "8", name: "Aniket Rajhans" },
  { buildingNo: "5", flatNo: "9", name: "Dilip Hakke" },
  { buildingNo: "5", flatNo: "10", name: "Jayant Sapre" },
  { buildingNo: "5", flatNo: "11", name: "Anup Ramteke" },
  { buildingNo: "5", flatNo: "12", name: "Avinash Namdeo Dhakane" },
  { buildingNo: "5", flatNo: "13", name: "Vilas Kharkar" },
  { buildingNo: "5", flatNo: "14", name: "Anand Damle" },
  { buildingNo: "5", flatNo: "15", name: "Surendra Gore" },
  { buildingNo: "5", flatNo: "16", name: "Yogita Kale" },
  { buildingNo: "5", flatNo: "17", name: "Balkrishna Shirsat" },
  { buildingNo: "5", flatNo: "18", name: "Milind Mandke" },
  { buildingNo: "5", flatNo: "19", name: "Asavari Kulkarni" },
  { buildingNo: "5", flatNo: "20", name: "Prabhakar Deshpande" },
  { buildingNo: "5", flatNo: "21", name: "Prasanna Dehadray" },
  { buildingNo: "5", flatNo: "22", name: "Nitin Pandit" },
  { buildingNo: "5", flatNo: "23", name: "Prachi Bokil" },
  { buildingNo: "5", flatNo: "24", name: "Raghunath Patwardhan" },
  { buildingNo: "5", flatNo: "25", name: "Mangesh Dhuri" },
  { buildingNo: "5", flatNo: "26A", name: "Satish Malwadkar" },
  { buildingNo: "5", flatNo: "26B", name: "Shakuntala Kothari" },
  { buildingNo: "5", flatNo: "27A", name: "Phakkadrao Landge" },
  { buildingNo: "5", flatNo: "27B", name: "Kalyani Bapat" },
  { buildingNo: "5", flatNo: "28", name: "Ashok Godbole" },
  { buildingNo: "5", flatNo: "29", name: "Jyotsna Kulkarni" },
  { buildingNo: "5", flatNo: "30", name: "Satishchandra Desigar" },
  { buildingNo: "5", flatNo: "31", name: "Prakashchandra Desigar" },
  { buildingNo: "5", flatNo: "32", name: "Dilip Agate" },

  // Building 6 (only non-empty names)
  { buildingNo: "6", flatNo: "7", name: "Satish Pawar" },
  { buildingNo: "6", flatNo: "8", name: "Ashok Varde" },
  { buildingNo: "6", flatNo: "9", name: "Shrinivas Sant" },
  { buildingNo: "6", flatNo: "10", name: "Anita Varde" },
  { buildingNo: "6", flatNo: "11", name: "Narhari Joshi" },
  { buildingNo: "6", flatNo: "12", name: "Manisha Bhadane" },
  { buildingNo: "6", flatNo: "19", name: "Anand Kudal" },
  { buildingNo: "6", flatNo: "20", name: "Pravin Pathak" },
  { buildingNo: "6", flatNo: "21", name: "Ramchandra Vartak" },
  { buildingNo: "6", flatNo: "22", name: "Vilas Pandit" },
  { buildingNo: "6", flatNo: "23", name: "Dilip Deshpande" },
  { buildingNo: "6", flatNo: "24", name: "Pradip Naidu" },
  { buildingNo: "6", flatNo: "31", name: "Dattatray Gaikwad" },
  { buildingNo: "6", flatNo: "32", name: "Prabha Honap" },
  { buildingNo: "6", flatNo: "33", name: "Suvarna Jagtap" },
  { buildingNo: "6", flatNo: "34", name: "Lakshmikant Kulkarni" },
  { buildingNo: "6", flatNo: "35", name: "Narendra Kulkarni" },
  { buildingNo: "6", flatNo: "36", name: "Shila Utkur" },
  { buildingNo: "6", flatNo: "43", name: "Ashwini Rajwade" },
  { buildingNo: "6", flatNo: "44", name: "Pralhad Dhande" },
  { buildingNo: "6", flatNo: "45", name: "Shri Mandar Rajwade" },
  { buildingNo: "6", flatNo: "46", name: "Suresh Deshpande" },
  { buildingNo: "6", flatNo: "47", name: "Ushaprabha Inamke" },
  { buildingNo: "6", flatNo: "48", name: "Anand Sant" },

  // Building 7
  { buildingNo: "7", flatNo: "1", name: "Avinash Medhekar" },
  { buildingNo: "7", flatNo: "2", name: "Aniruddha Vijayrao Deshpande" },
  { buildingNo: "7", flatNo: "3", name: "Rajendra Shivde" },
  { buildingNo: "7", flatNo: "4", name: "Shubhangi Joshi" },
  { buildingNo: "7", flatNo: "5", name: "Govind Kulkarni" },
  { buildingNo: "7", flatNo: "6", name: "Vasant Komkar" },
  { buildingNo: "7", flatNo: "7", name: "Nikhil Sabnis" },
  { buildingNo: "7", flatNo: "8", name: "Nikhil Sabnis" },
  { buildingNo: "7", flatNo: "9", name: "Vijaya Bendale" },
  { buildingNo: "7", flatNo: "10", name: "Dr Nayana Gopal Pachpande" },
  { buildingNo: "7", flatNo: "11", name: "Pramod Bendale" },
  { buildingNo: "7", flatNo: "12", name: "Dr Archana Girish Nehete" },
  { buildingNo: "7", flatNo: "13", name: "Suhas Sane" },
  { buildingNo: "7", flatNo: "14", name: "Anil Datar" },
  { buildingNo: "7", flatNo: "15", name: "Madhuri Sane" },
  { buildingNo: "7", flatNo: "16", name: "Anagha Datar" },
  { buildingNo: "7", flatNo: "17", name: "Vishnu Nalawade" },
  { buildingNo: "7", flatNo: "18", name: "Ramavatar Morarka" },
  { buildingNo: "7", flatNo: "19", name: "Pralhad Jadhav" },
  { buildingNo: "7", flatNo: "20", name: "Sharad Chatre" },
  { buildingNo: "7", flatNo: "21", name: "Kirtikumar Kakde" },
  { buildingNo: "7", flatNo: "22", name: "Sharad Chatre" },
  { buildingNo: "7", flatNo: "23", name: "Hemlata Kakde" },
  { buildingNo: "7", flatNo: "24", name: "Raju Bhanarkar" },
  { buildingNo: "7", flatNo: "25", name: "Vidya Atre" },
  { buildingNo: "7", flatNo: "26", name: "Sunil Kulkarni" },
  { buildingNo: "7", flatNo: "27", name: "Madhukar Shirwalkar" },
  { buildingNo: "7", flatNo: "28", name: "Sunil Kulkarni" },
  { buildingNo: "7", flatNo: "29", name: "Sudhakar Maladkar" },
  { buildingNo: "7", flatNo: "30", name: "Sudhakar Maladkar" },
  { buildingNo: "7", flatNo: "31", name: "Hanumant Kulkarni" },
  { buildingNo: "7", flatNo: "32", name: "Supriya Kulkarni" },
  { buildingNo: "7", flatNo: "33", name: "Malati Patil" },
  { buildingNo: "7", flatNo: "34", name: "Amol Dh Kamble" },
  { buildingNo: "7", flatNo: "35", name: "Nilesh Pathare" },
  { buildingNo: "7", flatNo: "36", name: "Mina Korlekar" },
  { buildingNo: "7", flatNo: "37", name: "Kundan Pore" },
  { buildingNo: "7", flatNo: "38", name: "Kundan Pore" },
  { buildingNo: "7", flatNo: "39", name: "Anuja Nerlekar" },
  { buildingNo: "7", flatNo: "40", name: "Sunil Munde" },
  { buildingNo: "7", flatNo: "41", name: "Anuja Nerlekar" },
  { buildingNo: "7", flatNo: "42", name: "Sunil Munde" },
  { buildingNo: "7", flatNo: "43", name: "Pandurang Kadam" },
  { buildingNo: "7", flatNo: "44", name: "Shri Santosh Na Tonde" },
  { buildingNo: "7", flatNo: "45", name: "Bhalchandra Kanade" },
  { buildingNo: "7", flatNo: "46", name: "Vijay Vi Kudle" },
  { buildingNo: "7", flatNo: "47", name: "Raghunandan Rakshe" },
  { buildingNo: "7", flatNo: "48", name: "Vyankat Kendre Patil" }
];

async function addResidentsToProduction() {
  try {
    console.log('🚀 Starting to migrate remaining residents data to PRODUCTION database...');
    console.log('📊 Target: Buildings 4, 5, 6, and 7');
    console.log(`� Total residents to process: ${residentsData.length}`);
    
  let successCount = 0;
  let errorCount = 0;    console.log('\n📥 Importing residents to production database...');
    
    for (const resident of residentsData) {
      try {
        // Use upsert to handle duplicates gracefully (same pattern as migrate-local-to-prod.js)
        await prodPrisma.resident.upsert({
          where: {
            buildingNo_flatNo: {
              buildingNo: resident.buildingNo,
              flatNo: resident.flatNo,
            },
          },
          update: {
            name: resident.name,
          },
          create: {
            buildingNo: resident.buildingNo,
            flatNo: resident.flatNo,
            name: resident.name,
          },
        });
        
        successCount++;
        console.log(`   ✅ Added: Building ${resident.buildingNo}, Flat ${resident.flatNo} - ${resident.name}`);
      } catch (error) {
        errorCount++;
        console.error(`   ❌ Error adding Building ${resident.buildingNo}, Flat ${resident.flatNo} - ${resident.name}:`, error.message);
      }
    }

    console.log('\n📊 Production Migration Summary:');
    console.log(`   ✅ Successfully added/updated: ${successCount} residents`);
    console.log(`   ❌ Errors: ${errorCount} residents`);
    console.log(`   📝 Total processed: ${residentsData.length} residents`);

    // Verify the data in production (same pattern as migrate-local-to-prod.js)
    console.log('\n🔍 Verifying production data...');
    const building4Count = await prodPrisma.resident.count({ where: { buildingNo: "4" } });
    const building5Count = await prodPrisma.resident.count({ where: { buildingNo: "5" } });
    const building6Count = await prodPrisma.resident.count({ where: { buildingNo: "6" } });
    const building7Count = await prodPrisma.resident.count({ where: { buildingNo: "7" } });
    const totalCount = await prodPrisma.resident.count();

    console.log('\n📊 Production Database Summary:');
    console.log(`   🏢 Building 4: ${building4Count} residents`);
    console.log(`   🏢 Building 5: ${building5Count} residents`);
    console.log(`   🏢 Building 6: ${building6Count} residents`);
    console.log(`   🏢 Building 7: ${building7Count} residents`);
    console.log(`   🏗️  Total residents in PRODUCTION database: ${totalCount}`);

    console.log('\n🎉 Production migration completed successfully!');
    console.log('🌐 Your data is now available on: https://vargani-management-system.vercel.app');

  } catch (error) {
    console.error('❌ Error during production migration:', error);
  } finally {
    await prodPrisma.$disconnect();
    console.log('\n🔒 Database connection closed.');
  }
}

// Run the script
if (require.main === module) {
  addResidentsToProduction()
    .then(() => {
      console.log('\n🎉 Production migration completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Production migration failed:', error);
      process.exit(1);
    });
}

module.exports = { addResidentsToProduction, residentsData };
