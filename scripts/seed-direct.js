const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const residents = [
  { buildingNo: "2", flatNo: "3", name: "Bhaskar Kaatokar" },
  { buildingNo: "2", flatNo: "4", name: "Smita Jog" },
  { buildingNo: "2", flatNo: "5", name: "Vishal Ram Gayakwad" },
  { buildingNo: "2", flatNo: "6", name: "Ramchandra Gayakwad" },
  { buildingNo: "2", flatNo: "11", name: "Devendra Bhide" },
  { buildingNo: "2", flatNo: "12", name: "Chandrakant Ekatpure" },
  { buildingNo: "2", flatNo: "13", name: "Bharat Rande" },
  { buildingNo: "2", flatNo: "14", name: "Rande" },
  { buildingNo: "2", flatNo: "19", name: "Archana Pandit" },
  { buildingNo: "2", flatNo: "20", name: "Prasad Gadkari" },
  { buildingNo: "2", flatNo: "21", name: "Sanjay Dhumal" },
  { buildingNo: "2", flatNo: "22", name: "Prachi Rande" },
  { buildingNo: "2", flatNo: "27", name: "Shribhau Prabhakar Jadhav" },
  { buildingNo: "2", flatNo: "28", name: "Prashant Manakam" },
  { buildingNo: "2", flatNo: "29", name: "Mahadev Joshi" },
  { buildingNo: "2", flatNo: "30", name: "Vasant Bopardikar" },
  { buildingNo: "2", flatNo: "35", name: "Aakar Deshpande" },
  { buildingNo: "2", flatNo: "36", name: "Ashok Mandekar" },
  { buildingNo: "2", flatNo: "37", name: "Suresh Rande" },
  { buildingNo: "2", flatNo: "38", name: "Mayur Ubarkar" },
  { buildingNo: "3", flatNo: "1", name: "Bhagwant Kale" },
  { buildingNo: "3", flatNo: "2", name: "Vishwas Date" },
  { buildingNo: "3", flatNo: "7", name: "Shrikant Jadhav" },
  { buildingNo: "3", flatNo: "8", name: "Mrs. Medha Divekar" },
  { buildingNo: "3", flatNo: "9", name: "Vina Bhalerao" },
  { buildingNo: "3", flatNo: "10", name: "Rasika Vaidya" },
  { buildingNo: "3", flatNo: "15", name: "Dinesh Subhedar" },
  { buildingNo: "3", flatNo: "16", name: "Virendra M. Joshi" },
  { buildingNo: "3", flatNo: "17", name: "Suhas Rande" },
  { buildingNo: "3", flatNo: "18", name: "Chandrashekhar Sarang" },
  { buildingNo: "3", flatNo: "23", name: "Prasad Supur" },
  { buildingNo: "3", flatNo: "28", name: "Abhay Vasant Bhosale" },
  { buildingNo: "3", flatNo: "25", name: "Sumantra Raut" },
  { buildingNo: "3", flatNo: "26", name: "Mrs. Renuka Wankhade" },
  { buildingNo: "3", flatNo: "32", name: "Jayashree Kulkarni" },
  { buildingNo: "3", flatNo: "33", name: "Uddhav S. Balse" },
  { buildingNo: "3", flatNo: "38", name: "Raghubeer Kopikar" },
  { buildingNo: "3", flatNo: "39", name: "Vikrant Chitle" },
  { buildingNo: "3", flatNo: "40", name: "Shreeramchandra Konda" },
  { buildingNo: "3", flatNo: "41", name: "Rahul Ghaghekar" },
  { buildingNo: "3", flatNo: "42", name: "Anaya Dhondge" },
  { buildingNo: "3", flatNo: "47", name: "Pramod Malatkar" },
  { buildingNo: "3", flatNo: "48", name: "Varsha Chaudhari" },
  { buildingNo: "3", flatNo: "3", name: "Shubhada Daandekar" },
  { buildingNo: "3", flatNo: "4", name: "Rajarama Kamthe" },
  { buildingNo: "3", flatNo: "5", name: "Sandeep Gawade" },
  { buildingNo: "3", flatNo: "11", name: "Shrinivas Bhatkhande" },
  { buildingNo: "3", flatNo: "12", name: "Kedar Gadhil" },
  { buildingNo: "3", flatNo: "13", name: "Sachin Ghagpati" },
  { buildingNo: "3", flatNo: "14", name: "Sachin Vinayak Vedpathak" },
  { buildingNo: "3", flatNo: "19", name: "Rohit Sathe" },
  { buildingNo: "3", flatNo: "20", name: "Pinki Kute" },
  { buildingNo: "3", flatNo: "21", name: "Subodh Chakhale" },
  { buildingNo: "3", flatNo: "22", name: "Dr. Prakash Kosevekar" },
  { buildingNo: "3", flatNo: "27", name: "Arvind Kale" },
  { buildingNo: "3", flatNo: "28", name: "Prabhakar Kulkarni" },
  { buildingNo: "3", flatNo: "29", name: "Gopal Bhagwant Prasade" },
  { buildingNo: "3", flatNo: "30", name: "Deepali Rajwade" },
  { buildingNo: "3", flatNo: "35", name: "Tushar Pethekar" },
  { buildingNo: "3", flatNo: "36", name: "Surendra Pashankar" },
  { buildingNo: "3", flatNo: "37", name: "Pralhad Deshpande" },
  { buildingNo: "3", flatNo: "38", name: "Shri. Manohar Joshi" },
  { buildingNo: "3", flatNo: "43", name: "Jyotsna Wavikar" },
  { buildingNo: "3", flatNo: "44", name: "Amey Ranganath Gandre" },
  { buildingNo: "3", flatNo: "45", name: "Smt. Uma Vijay Karve" },
  { buildingNo: "3", flatNo: "46", name: "Sangeeta Ubarkar" },
  { buildingNo: "2", flatNo: "1", name: "Vivek Damle" },
  { buildingNo: "2", flatNo: "2", name: "Sagarika Gaodbole" },
  { buildingNo: "2", flatNo: "7", name: "Sachin Kulkarni" },
  { buildingNo: "2", flatNo: "8", name: "Anand Ukirde" },
  { buildingNo: "2", flatNo: "9", name: "Urmila Gokhale" },
  { buildingNo: "2", flatNo: "10", name: "Swapnil Vijay Kasar" },
  { buildingNo: "2", flatNo: "15", name: "Sagar Palod" },
  { buildingNo: "2", flatNo: "16", name: "Kumar Jere" },
  { buildingNo: "2", flatNo: "17", name: "Asha Kher" },
  { buildingNo: "2", flatNo: "18", name: "Yogita Kher" },
  { buildingNo: "2", flatNo: "23", name: "Snehalata Patankar" },
  { buildingNo: "2", flatNo: "24", name: "Atul Hardikar" },
  { buildingNo: "2", flatNo: "25", name: "Ranjana Kanitkar" },
  { buildingNo: "2", flatNo: "26", name: "Kedar Gadkari" },
  { buildingNo: "2", flatNo: "31", name: "Dinkar Ranadive" },
  { buildingNo: "2", flatNo: "32", name: "Vasant Marathe" },
  { buildingNo: "2", flatNo: "33", name: "Madhav Phansalkar" },
  { buildingNo: "2", flatNo: "34", name: "Prashant Harjude" },
  { buildingNo: "2", flatNo: "39", name: "Medha Kelkar" },
  { buildingNo: "2", flatNo: "40", name: "Ramchandra Joshi" }
]

async function main() {
  console.log('🌱 Starting to seed database with resident data...')
  
  try {
    // Check if data already exists
    const existingCount = await prisma.resident.count()
    console.log(`📊 Found ${existingCount} existing residents in database`)
    
    if (existingCount > 0) {
      console.log('✅ Database already has resident data. Showing current summary:')
      
      const buildings = await prisma.resident.groupBy({
        by: ['buildingNo'],
        _count: { buildingNo: true },
        orderBy: { buildingNo: 'asc' }
      })
      
      buildings.forEach(building => {
        console.log(`   📍 Building ${building.buildingNo}: ${building._count.buildingNo} residents`)
      })
      
      return
    }

    // Insert residents using createMany for faster insertion
    console.log(`📥 Inserting ${residents.length} residents...`)
    
    const result = await prisma.resident.createMany({
      data: residents.map(resident => ({
        buildingNo: resident.buildingNo,
        flatNo: resident.flatNo,
        name: resident.name,
        contactNo: null
      })),
      skipDuplicates: true
    })

    console.log(`✅ Successfully inserted ${result.count} residents!`)
    
    // Show summary
    const buildings = await prisma.resident.groupBy({
      by: ['buildingNo'],
      _count: { buildingNo: true },
      orderBy: { buildingNo: 'asc' }
    })
    
    console.log('\n📊 Summary by building:')
    buildings.forEach(building => {
      console.log(`   📍 Building ${building.buildingNo}: ${building._count.buildingNo} residents`)
    })
    
    console.log('\n🎉 Database seeding completed successfully!')
    
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await prisma.$disconnect()
    console.log('📝 Database connection closed')
  }
}

main()
  .catch((e) => {
    console.error('💥 Fatal error:', e)
    process.exit(1)
  })
