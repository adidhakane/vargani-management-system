import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function importResidents() {
  try {
    console.log('Starting resident data import...')
    
    // Read CSV file
    const csvPath = path.join(process.cwd(), 'residents-data.csv')
    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    
    // Parse CSV (skip header row)
    const lines = csvContent.split('\n').slice(1)
    const residents = lines
      .filter(line => line.trim()) // Remove empty lines
      .map(line => {
        const [buildingNo, flatNo, name, contactNo] = line.split(',')
        return {
          buildingNo: buildingNo.trim(),
          flatNo: flatNo.trim(),
          name: name.trim(),
          contactNo: contactNo && contactNo.trim() !== '' ? contactNo.trim() : null,
        }
      })

    console.log(`Found ${residents.length} residents to import`)

    // Clear existing data (for fresh import)
    await prisma.resident.deleteMany()
    console.log('Cleared existing resident data')

    // Import residents
    let imported = 0
    for (const resident of residents) {
      try {
        await prisma.resident.create({
          data: resident
        })
        imported++
        if (imported % 10 === 0) {
          console.log(`Imported ${imported}/${residents.length} residents...`)
        }
      } catch (error) {
        console.error(`Error importing resident ${resident.name}:`, error)
      }
    }

    console.log(`✅ Successfully imported ${imported} residents!`)
    
    // Verify import
    const buildingCounts = await prisma.resident.groupBy({
      by: ['buildingNo'],
      _count: {
        id: true
      },
      orderBy: {
        buildingNo: 'asc'
      }
    })

    console.log('\n📊 Import Summary:')
    buildingCounts.forEach(building => {
      console.log(`Building ${building.buildingNo}: ${building._count.id} residents`)
    })

  } catch (error) {
    console.error('Error importing residents:', error)
  } finally {
    await prisma.$disconnect()
  }
}

importResidents()
