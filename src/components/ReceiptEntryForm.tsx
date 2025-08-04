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
  amount: z.string().min(1, 'Amount is required').refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Amount must be a positive number',
  }),
  name: z.string().optional(),
  contactNo: z.string().optional(),
  paymentMode: z.enum(['cash', 'online'], {
    message: 'Payment mode is required',
  }),
  dateTime: z.string().min(1, 'Date and time is required'),
  addToWhatsApp: z.boolean().optional(),
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
      addToWhatsApp: false, // Default WhatsApp checkbox to unchecked
    },
  })

  const selectedBuilding = watch('buildingNo')
  const selectedFlat = watch('flatNo')
  const contactNo = watch('contactNo')

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

  const onSubmit = async (data: ReceiptFormData) => {
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
          addToWhatsApp: data.addToWhatsApp || false,
        }),
      })

      if (response.ok) {
        
        // Handle WhatsApp group addition if checkbox is checked and phone number exists
        if (data.addToWhatsApp && data.contactNo && data.contactNo.trim()) {
          // Format phone number for WhatsApp (add +91 if needed)
          let formattedPhone = data.contactNo.replace(/\D/g, '') // Remove non-digits
          if (formattedPhone.startsWith('0')) {
            formattedPhone = '91' + formattedPhone.substring(1) // Replace leading 0 with 91
          } else if (!formattedPhone.startsWith('91') && formattedPhone.length === 10) {
            formattedPhone = '91' + formattedPhone // Add 91 prefix for 10-digit numbers
          }
          
          console.log('Formatted phone number:', formattedPhone) // Debug log
          
          // Group invite link
          const groupInviteLink = 'https://chat.whatsapp.com/FoALq8qPMS9BgoHPJGqRsv'
          
          // Create personalized message for personal chat
          const contributorName = data.name || 'मित्रा'
          const amount = Number(data.amount)
          const message = `🙏 गणपती बाप्पा मोरया! ${contributorName}!

तुमच्या ₹${amount} च्या उदार योगदानाबद्दल मनापासून धन्यवाद! 🏠✨

आमच्या गणेशोत्सव WhatsApp समुदायात सामील व्हा आणि आनंद वाटा:
• कार्यक्रमाचे फोटो आणि व्हिडिओ
• सांस्कृतिक कार्यक्रमाची वेळ  
• प्रसाद वितरणाची माहिती
• आरती आणि पूजेची वेळ
• समुदायाची सर्व अपडेट्स

आमच्या गटात सामील व्हा: ${groupInviteLink}

🌟 एकत्र उत्सव साजरा करूया!
गणपती बाप्पा मोरया! मंगलमूर्ती मोरया! 🐘🙏✨`
          
          // Create WhatsApp URL to open personal chat with pre-filled message
          const whatsappChatUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`
          
          const userConfirmed = confirm(
            `✅ पावती यशस्वीरित्या जतन झाली!\n\n` +
            `📱 ${contributorName} ला गणेशोत्सव WhatsApp गटात आमंत्रित करायचे?\n\n` +
            `'ओके' दाबा आणि व्यक्तिशः संदेश पाठवा.\n` +
            `संदेश तयार आहे, फक्त पाहून पाठवा!`
          )
          
          if (userConfirmed) {
            // Open WhatsApp chat with pre-filled message
            window.open(whatsappChatUrl, '_blank')
          } else {
            alert('✅ पावती जतन झाली!')
          }
        } else {
          alert('✅ पावती यशस्वीरित्या जतन झाली!')
        }

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
            Amount (₹) *
          </label>
          <input
            type="number"
            step="1"
            min="0"
            {...register('amount')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
            placeholder="Enter amount"
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
          )}
        </div>

        {/* Payment Mode */}
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
            Contact Number
          </label>
          <input
            type="tel"
            {...register('contactNo')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
            placeholder="Auto-populated or enter manually"
          />
          
          {/* WhatsApp Group Checkbox */}
          {contactNo && contactNo.trim() && (
            <div className="mt-3 flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('addToWhatsApp')}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-green-300 rounded"
                />
                <label htmlFor="addToWhatsApp" className="text-sm font-medium text-green-800">
                  Add to Ganeshotsav WhatsApp group?
                </label>
              </div>
              <div className="flex-1 text-xs text-green-600">
                📱 Get updates and connect with the community
              </div>
            </div>
          )}
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
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Receipt
            </>
          )}
        </button>
      </div>
    </form>
  )
}
