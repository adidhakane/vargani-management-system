const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Your actual data from the dashboard
const yourReceiptsData = [
  // Building 2 data
  { buildingNo: '2', flatNo: '35', amount: 250.00, name: 'Amar Gole', dateTime: new Date('2025-08-03T19:54:00') },
  { buildingNo: '2', flatNo: '28', amount: 1001.00, name: 'Prashant Mankame', dateTime: new Date('2025-08-03T19:53:00') },
  { buildingNo: '2', flatNo: '30', amount: 400.00, name: 'Vasant Bopardikar', dateTime: new Date('2025-08-03T19:53:00') },
  { buildingNo: '2', flatNo: '21', amount: 1000.00, name: 'Sanjay Dhumal', dateTime: new Date('2025-08-03T19:52:00') },
  { buildingNo: '2', flatNo: '5', amount: 501.00, name: 'Vishal Ram Gaikwad', dateTime: new Date('2025-08-03T19:51:00') },
  { buildingNo: '2', flatNo: '9', amount: 500.00, name: 'Sunil Gokhale', dateTime: new Date('2025-08-03T19:51:00') },
  { buildingNo: '2', flatNo: '16', amount: 1001.00, name: 'Sanjay Jere', dateTime: new Date('2025-08-03T19:50:00') },
  { buildingNo: '2', flatNo: '15', amount: 500.00, name: 'Sagar Pallod', dateTime: new Date('2025-08-03T19:46:00') },
  { buildingNo: '2', flatNo: '24', amount: 1992.00, name: 'Atul Hardikar', dateTime: new Date('2025-08-03T19:46:00') },
  { buildingNo: '2', flatNo: '23', amount: 251.00, name: 'Parikshit Shirsat', dateTime: new Date('2025-08-03T18:55:00') },
  { buildingNo: '2', flatNo: '25', amount: 100.00, name: 'Ranjana Kanitkar', dateTime: new Date('2025-08-03T18:55:00') },
  { buildingNo: '2', flatNo: '40', amount: 299.95, name: 'Ramchandra Joshi', dateTime: new Date('2025-08-03T18:54:00') },
  { buildingNo: '2', flatNo: '39', amount: 501.00, name: 'Bharat Manjule', dateTime: new Date('2025-08-03T18:52:00') },
  { buildingNo: '2', flatNo: '34', amount: 250.80, name: 'Rushikesh Bari', dateTime: new Date('2025-08-03T18:51:00') },

  // Building 3 data
  { buildingNo: '3', flatNo: '2', amount: 501.00, name: 'Limaye', dateTime: new Date('2025-08-03T20:07:00') },
  { buildingNo: '3', flatNo: '10', amount: 201.00, name: 'Aishwarya Verma', dateTime: new Date('2025-08-03T20:06:00') },
  { buildingNo: '3', flatNo: '9', amount: 500.00, name: 'Vina Bhalerao', dateTime: new Date('2025-08-03T20:06:00') },
  { buildingNo: '3', flatNo: '17', amount: 251.00, name: 'Suhas Ranade', dateTime: new Date('2025-08-03T20:05:00') },
  { buildingNo: '3', flatNo: '24', amount: 200.00, name: 'Saurabh Aparaje', dateTime: new Date('2025-08-03T20:05:00') },
  { buildingNo: '3', flatNo: '23', amount: 251.00, name: 'R. A. Katkar', dateTime: new Date('2025-08-03T20:04:00') },
  { buildingNo: '3', flatNo: '34', amount: 501.00, name: 'Kunal Bhokare', dateTime: new Date('2025-08-03T20:04:00') },
  { buildingNo: '3', flatNo: '40', amount: 751.00, name: 'Shreeramchandra Konda', dateTime: new Date('2025-08-03T20:03:00') },
  { buildingNo: '3', flatNo: '41', amount: 251.00, name: 'Rahul Ghanekar', dateTime: new Date('2025-08-03T20:03:00') },
  { buildingNo: '3', flatNo: '45', amount: 501.00, name: 'Vijay Karve', dateTime: new Date('2025-08-03T20:02:00') },
  { buildingNo: '3', flatNo: '48', amount: 1001.00, name: 'Varsha Chaudhary', dateTime: new Date('2025-08-03T20:02:00') },
  { buildingNo: '3', flatNo: '43', amount: 201.00, name: 'Jyotsna Wavikar', dateTime: new Date('2025-08-03T20:01:00') },
  { buildingNo: '3', flatNo: '44', amount: 2000.00, name: 'Amey Gadre', dateTime: new Date('2025-08-03T20:01:00') },
  { buildingNo: '3', flatNo: '30', amount: 500.00, name: 'Nitin Pendse', dateTime: new Date('2025-08-03T20:00:00') },
  { buildingNo: '3', flatNo: '36', amount: 150.00, name: 'Hemant Bhalerao', dateTime: new Date('2025-08-03T20:00:00') },
  { buildingNo: '3', flatNo: '28', amount: 501.00, name: 'Prasanna Kulkarni', dateTime: new Date('2025-08-03T19:59:00') },
  { buildingNo: '3', flatNo: '20', amount: 300.00, name: 'Jagannath Kumthe', dateTime: new Date('2025-08-03T19:58:00') },
  { buildingNo: '3', flatNo: '11', amount: 500.00, name: 'Shrinivas Bhatkhande', dateTime: new Date('2025-08-03T19:57:00') },
  { buildingNo: '3', flatNo: '13', amount: 501.00, name: 'Prasad Deshpande', dateTime: new Date('2025-08-03T19:57:00') },
  { buildingNo: '3', flatNo: '6', amount: 3000.00, name: 'Rahul Kamthe', dateTime: new Date('2025-08-03T19:56:00') },
  { buildingNo: '3', flatNo: '3', amount: 251.00, name: 'Yash More', dateTime: new Date('2025-08-03T19:54:00') },
]

async function importYourData() {
  try {
    console.log('🚀 Importing your actual data to the database...')

    // First, create residents from the receipt data
    console.log('📦 Creating residents...')
    const residentsToCreate = []
    const seen = new Set()

    yourReceiptsData.forEach(receipt => {
      const key = `${receipt.buildingNo}-${receipt.flatNo}`
      if (!seen.has(key)) {
        seen.add(key)
        residentsToCreate.push({
          buildingNo: receipt.buildingNo,
          flatNo: receipt.flatNo,
          name: receipt.name,
          contactNo: null // You didn't provide contact numbers
        })
      }
    })

    // Create residents
    for (const resident of residentsToCreate) {
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
    console.log(`✅ Created ${residentsToCreate.length} residents`)

    // Create receipts
    console.log('🧾 Creating receipts...')
    for (const receipt of yourReceiptsData) {
      await prisma.receipt.create({
        data: {
          buildingNo: receipt.buildingNo,
          flatNo: receipt.flatNo,
          amount: receipt.amount,
          name: receipt.name,
          contactNo: null,
          dateTime: receipt.dateTime,
          paymentMode: 'cash' // Default payment mode
        },
      })
    }
    console.log(`✅ Created ${yourReceiptsData.length} receipts`)

    // Summary
    console.log('\n📊 Import Summary:')
    const building2Total = yourReceiptsData
      .filter(r => r.buildingNo === '2')
      .reduce((sum, r) => sum + r.amount, 0)
    const building3Total = yourReceiptsData
      .filter(r => r.buildingNo === '3')
      .reduce((sum, r) => sum + r.amount, 0)

    console.log(`   Building 2: ${yourReceiptsData.filter(r => r.buildingNo === '2').length} receipts, Total: ₹${building2Total}`)
    console.log(`   Building 3: ${yourReceiptsData.filter(r => r.buildingNo === '3').length} receipts, Total: ₹${building3Total}`)
    console.log(`   Grand Total: ₹${building2Total + building3Total}`)

    console.log('\n🎉 Your data has been successfully imported!')
    console.log('🌐 Now check your production dashboard at: https://vargani-management-system-ad.vercel.app')

  } catch (error) {
    console.error('❌ Error importing data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

importYourData()
