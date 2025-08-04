'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Save, Calendar } from 'lucide-react'
import { formatDateTimeLocalIST } from '@/lib/date-utils'

const receiptSchema = z.object({
  buildingNo: z.string().min(1, 'Building number is required'),
  flatNo: z.string().min(1, 'Flat number is required'),
  amount: z.string().optional(),
  name: z.string().optional(),
  contactNo: z.string().optional(),
  paymentMode: z.enum(['cash', 'online']).optional(),
  dateTime: z.string().min(1, 'Date and time is required'),
}).refine((data) => {
  // If amount is provided, it must be valid and payment mode is required
  if (data.amount && data.amount.trim() !== '') {
    const amountNum = Number(data.amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      return false
    }
    if (!data.paymentMode) {
      return false
    }
  }
  return true
}, {
  message: 'When amount is entered, it must be a positive number and payment mode is required',
  path: ['amount']
})

type ReceiptFormData = z.infer<typeof receiptSchema>

interface Resident {
  buildingNo: string
  flatNo: string
  name: string
  contactNo?: string
}

export default function ReceiptEntryForm() {
  const [buildings, setBuildings] = useState<string[]>([])
  const [flats, setFlats] = useState<string[]>([])
  const [residents, setResidents] = useState<Resident[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<ReceiptFormData>({
    resolver: zodResolver(receiptSchema),
    defaultValues: {
      paymentMode: 'cash', // Default to cash payment
      dateTime: formatDateTimeLocalIST(), // Current date-time in IST format
    },
  })

  const selectedBuilding = watch('buildingNo')
  const selectedFlat = watch('flatNo')
  const currentAmount = watch('amount')
  const currentContactNo = watch('contactNo')

  // Fetch buildings and residents on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/residents')
        if (response.ok) {
          const data = await response.json()
          setResidents(data)
          
          // Extract unique buildings
          const uniqueBuildings = [...new Set(data.map((r: Resident) => r.buildingNo))].sort() as string[]
          setBuildings(uniqueBuildings)
        }
      } catch (error) {
        console.error('Error fetching residents:', error)
      }
    }
    
    fetchData()
  }, [])

  // Update flats when building is selected
  useEffect(() => {
    if (selectedBuilding) {
      const buildingFlats = residents
        .filter(r => r.buildingNo === selectedBuilding)
        .map(r => r.flatNo)
        .sort((a, b) => Number(a) - Number(b))
      setFlats(buildingFlats)
      setValue('flatNo', '') // Reset flat selection
      setValue('name', '') // Reset name
      setValue('contactNo', '') // Reset contact
    }
  }, [selectedBuilding, residents, setValue])

  // Auto-populate name and contact when building and flat are selected
  useEffect(() => {
    if (selectedBuilding && selectedFlat) {
      const resident = residents.find(
        r => r.buildingNo === selectedBuilding && r.flatNo === selectedFlat
      )
      if (resident) {
        setValue('name', resident.name)
        setValue('contactNo', resident.contactNo || '')
      }
    }
  }, [selectedBuilding, selectedFlat, residents, setValue])

  // WhatsApp functionality
  const openWhatsAppChat = (contactNo: string) => {
    // Clean the contact number - remove any non-digit characters
    const cleanNumber = contactNo.replace(/\D/g, '')
    
    // Add country code if not present (assuming India +91)
    let phoneNumber = cleanNumber
    if (phoneNumber.length === 10) {
      phoneNumber = '91' + phoneNumber
    } else if (phoneNumber.startsWith('91') && phoneNumber.length === 12) {
      // Already has country code
    } else if (phoneNumber.startsWith('0') && phoneNumber.length === 11) {
      // Remove leading 0 and add country code
      phoneNumber = '91' + phoneNumber.substring(1)
    }

    // WhatsApp message and group invitation link
    const message = `🎉 *Ganeshotsav 2025 - Vargani Collection* 🎉

नमस्कार! आपका गणेशोत्सव वर्गणी संग्रह के लिए स्वागत है।

🏠 *Building*: ${selectedBuilding}
🚪 *Flat*: ${selectedFlat}
👤 *Name*: ${watch('name') || 'N/A'}

कृपया हमारे गणेशोत्सव WhatsApp ग्रुप में शामिल हों:
👥 *Group Link*: https://chat.whatsapp.com/FoALq8qPMS9BgoHPJGqRsv

अधिक जानकारी के लिए संपर्क करें।

धन्यवाद! 🙏`

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message)
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank')
    
    // Show success message
    alert('📱 WhatsApp चैट खोला गया है! संदेश और ग्रुप लिंक भेजा गया है।')
    
    // Reset form after WhatsApp action
    reset({
      buildingNo: '',
      flatNo: '',
      amount: '',
      name: '',
      contactNo: '',
      paymentMode: 'cash',
      dateTime: formatDateTimeLocalIST(),
    })
  }

  const onSubmit = async (data: ReceiptFormData) => {
    // Check if contact number is provided (WhatsApp flow)
    if (data.contactNo && data.contactNo.trim() !== '') {
      openWhatsAppChat(data.contactNo)
      return
    }

    // Check if amount is provided (Database storage flow)
    if (!data.amount || data.amount.trim() === '') {
      alert('कृपया राशि या संपर्क नंबर दर्ज करें।')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/receipts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          buildingNo: data.buildingNo,
          flatNo: data.flatNo,
          amount: Number(data.amount),
          name: data.name,
          contactNo: data.contactNo,
          paymentMode: data.paymentMode,
          dateTime: new Date(data.dateTime).toISOString(),
        }),
      })

      if (response.ok) {
        alert('✅ Receipt saved successfully!')

        reset({
          buildingNo: '',
          flatNo: '',
          amount: '',
          name: '',
          contactNo: '',
          paymentMode: 'cash',
          dateTime: formatDateTimeLocalIST(),
        })
      } else {
        const errorData = await response.json()
        alert(`त्रुटी: ${errorData.error || 'पावती जतन करताना त्रुटी'}`)
      }
    } catch (error) {
      console.error('Error saving receipt:', error)
      alert('पावती जतन करताना त्रुटी. कृपया पुन्हा प्रयत्न करा.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Building Number */}
        <div>
          <label htmlFor="buildingNo" className="block text-sm font-semibold text-gray-900 mb-2">
            Building Number *
          </label>
          <select
            {...register('buildingNo')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
          >
            <option value="" className="text-gray-500">Select Building</option>
            {buildings.map(building => (
              <option key={building} value={building} className="text-gray-900 font-medium">
                Building {building}
              </option>
            ))}
          </select>
          {errors.buildingNo && (
            <p className="mt-1 text-sm text-red-600">{errors.buildingNo.message}</p>
          )}
        </div>

        {/* Flat Number */}
        <div>
          <label htmlFor="flatNo" className="block text-sm font-semibold text-gray-900 mb-2">
            Flat Number *
          </label>
          <select
            {...register('flatNo')}
            disabled={!selectedBuilding}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 font-medium"
          >
            <option value="" className="text-gray-500">Select Flat</option>
            {flats.map(flat => (
              <option key={flat} value={flat} className="text-gray-900 font-medium">
                Flat {flat}
              </option>
            ))}
          </select>
          {errors.flatNo && (
            <p className="mt-1 text-sm text-red-600">{errors.flatNo.message}</p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="amount" className="block text-sm font-semibold text-gray-900 mb-2">
            Amount (₹) <span className="text-gray-500 text-xs">- OR enter phone number for WhatsApp</span>
          </label>
          <input
            type="number"
            step="1"
            min="0"
            {...register('amount')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
            placeholder="Enter amount (optional if using WhatsApp)"
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
          )}
        </div>

        {/* Payment Mode - Only show if amount is entered */}
        {currentAmount && currentAmount.trim() !== '' && (
          <div>
            <label htmlFor="paymentMode" className="block text-sm font-semibold text-gray-900 mb-2">
              Payment Mode *
            </label>
            <select
              {...register('paymentMode')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
            >
              <option value="cash" className="text-gray-900 font-medium">Cash</option>
              <option value="online" className="text-gray-900 font-medium">Online</option>
            </select>
            {errors.paymentMode && (
              <p className="mt-1 text-sm text-red-600">{errors.paymentMode.message}</p>
            )}
          </div>
        )}

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
            Resident Name
          </label>
          <input
            type="text"
            {...register('name')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
            placeholder="Auto-populated or enter manually"
          />
        </div>

        {/* Contact Number */}
        <div>
          <label htmlFor="contactNo" className="block text-sm font-semibold text-gray-900 mb-2">
            Contact Number <span className="text-green-600 text-xs">📱 (Enter to open WhatsApp)</span>
          </label>
          <input
            type="tel"
            {...register('contactNo')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 font-medium"
            placeholder="Enter phone number for WhatsApp invitation"
          />
        </div>

        {/* Date and Time */}
        <div>
          <label htmlFor="dateTime" className="block text-sm font-semibold text-gray-900 mb-2">
            Date & Time *
          </label>
          <div className="relative">
            <input
              type="datetime-local"
              {...register('dateTime')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
          {errors.dateTime && (
            <p className="mt-1 text-sm text-red-600">{errors.dateTime.message}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {currentContactNo && currentContactNo.trim() !== '' ? 'Open WhatsApp' : 'Save Receipt'}
            </>
          )}
        </button>
      </div>
    </form>
  )
}
