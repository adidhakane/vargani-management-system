'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import { BarChart3, Download, Edit2, Trash2, Save, X } from 'lucide-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { getCurrentISTString } from '@/lib/date-utils'

interface Receipt {
  id: number
  buildingNo: string
  flatNo: string
  amount: number
  name: string | null
  contactNo: string | null
  dateTime: string
  paymentMode?: string
  resident: {
    name: string
    contactNo: string | null
  } | null
}

interface AnalysisFormData {
  buildingNo: string
  date: string
  analysisType: 'date-building' | 'building-only' | 'remaining-flats'
}

export default function Dashboard() {
  const [buildings, setBuildings] = useState<string[]>([])
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [totalAmount, setTotalAmount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [allResidents, setAllResidents] = useState<{ buildingNo: string; flatNo: string; name: string; contactNo?: string }[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<{amount: string, name: string, paymentMode: string}>({amount: '', name: '', paymentMode: 'cash'})
  
  const { data: session } = useSession()
  const canEdit = session?.user && (session.user.role === 'approved' || session.user.role === 'admin')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AnalysisFormData>()

  const analysisType = watch('analysisType')

  // Fetch buildings on component mount
  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await fetch('/api/residents')
        if (response.ok) {
          const residents: Array<{ buildingNo: string; flatNo: string; name: string; contactNo?: string }> = await response.json()
          setAllResidents(residents)
          const uniqueBuildings = [...new Set(residents.map((r) => r.buildingNo))].sort() as string[]
          setBuildings(uniqueBuildings)
        }
      } catch (error) {
        console.error('Error fetching buildings:', error)
      }
    }
    
    fetchBuildings()
  }, [])

  const onSubmit = async (data: AnalysisFormData) => {
    setIsLoading(true)
    try {
      if (data.analysisType === 'remaining-flats') {
        // Handle remaining flats analysis
        await analyzeRemainingFlats(data.buildingNo)
      } else {
        // Handle receipt analysis
        const params = new URLSearchParams()
        if (data.buildingNo) params.append('buildingNo', data.buildingNo)
        if (data.date && data.analysisType === 'date-building') {
          params.append('date', data.date)
        }

        const response = await fetch(`/api/receipts?${params.toString()}`)
        if (response.ok) {
          const receiptsData = await response.json()
          // Sort receipts by flat number (numerically)
          const sortedReceipts = receiptsData.sort((a: Receipt, b: Receipt) => {
            return parseInt(a.flatNo) - parseInt(b.flatNo)
          })
          setReceipts(sortedReceipts)
          
          const total = receiptsData.reduce((sum: number, receipt: Receipt) => sum + Number(receipt.amount), 0)
          setTotalAmount(total)
        }
      }
    } catch (error) {
      console.error('Error fetching analysis data:', error)
      alert('Error fetching analysis data')
    } finally {
      setIsLoading(false)
    }
  }

  const analyzeRemainingFlats = async (buildingNo: string) => {
    try {
      // Get all residents for the building
      const allFlatsInBuilding = allResidents.filter(r => r.buildingNo === buildingNo)
      
      // Get receipts for the building
      const response = await fetch(`/api/receipts?buildingNo=${buildingNo}`)
      const receiptsData = await response.json()
      
      // Find flats with receipts
      const flatsWithReceipts = [...new Set(receiptsData.map((r: Receipt) => r.flatNo))]
      
      // Find remaining flats (without receipts)
      const remainingFlats = allFlatsInBuilding.filter(
        resident => !flatsWithReceipts.includes(resident.flatNo)
      )
      
      // Sort remaining flats by flat number (numerically)
      remainingFlats.sort((a, b) => parseInt(a.flatNo) - parseInt(b.flatNo))
      
      // Create mock receipt data for display
      const remainingFlatsReceipts = remainingFlats.map((resident) => ({
        id: 0,
        buildingNo: resident.buildingNo,
        flatNo: resident.flatNo,
        amount: 0,
        name: resident.name,
        contactNo: resident.contactNo || null,
        dateTime: '',
        resident: {
          name: resident.name,
          contactNo: resident.contactNo || null
        }
      }))
      
      setReceipts(remainingFlatsReceipts)
      setTotalAmount(0)
    } catch (error) {
      console.error('Error analyzing remaining flats:', error)
      alert('Error analyzing remaining flats')
    }
  }

  const startEdit = (receipt: Receipt) => {
    setEditingId(receipt.id)
    setEditForm({
      amount: receipt.amount.toString(),
      name: receipt.name || '',
      paymentMode: receipt.paymentMode || 'cash'
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({amount: '', name: '', paymentMode: 'cash'})
  }

  const saveEdit = async (id: number) => {
    try {
      const response = await fetch(`/api/receipts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(editForm.amount),
          name: editForm.name,
          paymentMode: editForm.paymentMode,
        }),
      })

      if (response.ok) {
        // Refresh the data
        const updatedReceipts = receipts.map(r => 
          r.id === id 
            ? { ...r, amount: parseFloat(editForm.amount), name: editForm.name, paymentMode: editForm.paymentMode }
            : r
        )
        setReceipts(updatedReceipts)
        
        // Recalculate total
        const newTotal = updatedReceipts.reduce((sum, receipt) => sum + Number(receipt.amount), 0)
        setTotalAmount(newTotal)
        
        cancelEdit()
        alert('Receipt updated successfully!')
      } else {
        alert('Error updating receipt')
      }
    } catch (error) {
      console.error('Error updating receipt:', error)
      alert('Error updating receipt')
    }
  }

  const deleteReceipt = async (id: number) => {
    if (!confirm('Are you sure you want to delete this receipt?')) {
      return
    }

    try {
      const response = await fetch(`/api/receipts/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Remove from local state
        const updatedReceipts = receipts.filter(r => r.id !== id)
        setReceipts(updatedReceipts)
        
        // Recalculate total
        const newTotal = updatedReceipts.reduce((sum, receipt) => sum + Number(receipt.amount), 0)
        setTotalAmount(newTotal)
        
        alert('Receipt deleted successfully!')
      } else {
        alert('Error deleting receipt')
      }
    } catch (error) {
      console.error('Error deleting receipt:', error)
      alert('Error deleting receipt')
    }
  }

  const generatePDF = () => {
    try {
      if (!receipts || receipts.length === 0) {
        alert('No data available to generate PDF. Please run an analysis first.')
        return
      }

      const doc = new jsPDF()
      
      // Add title
      doc.setFontSize(20)
      doc.text('Vargani Management System - Analysis Report', 20, 20)
      
      // Add date
      doc.setFontSize(12)
      doc.text(`Generated on: ${getCurrentISTString()}`, 20, 35)
      
      // Add analysis type
      const analysisTypeText = analysisType === 'date-building' ? 'Date & Building Analysis' :
                             analysisType === 'building-only' ? 'Building Analysis' :
                             'Remaining Flats Report'
      doc.text(`Analysis Type: ${analysisTypeText}`, 20, 45)
      
      if (analysisType !== 'remaining-flats') {
        doc.text(`Total Amount: ₹${totalAmount.toFixed(2)}`, 20, 55)
      }
      
      // Prepare table data
      const tableColumns = analysisType === 'remaining-flats' 
        ? ['Building No', 'Flat No', 'Resident Name', 'Contact No', 'Status']
        : ['Building No', 'Flat No', 'Amount (₹)', 'Resident Name', 'Date & Time']
      
      let tableRows: string[][]
      
      if (analysisType === 'remaining-flats') {
        tableRows = receipts.map(receipt => [
          receipt.buildingNo || 'N/A',
          receipt.flatNo || 'N/A',
          receipt.name || 'N/A',
          receipt.contactNo || 'N/A',
          'No Receipt'
        ])
      } else {
        tableRows = receipts.map(receipt => [
          receipt.buildingNo || 'N/A',
          receipt.flatNo || 'N/A',
          `₹${Number(receipt.amount || 0).toFixed(2)}`,
          receipt.name || receipt.resident?.name || 'N/A',
          receipt.dateTime ? new Date(receipt.dateTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'N/A'
        ])
      }
      
      // Add table with error handling
      try {
        autoTable(doc, {
          startY: analysisType !== 'remaining-flats' ? 65 : 55,
          head: [tableColumns],
          body: tableRows,
          styles: { fontSize: 10 },
          headStyles: { fillColor: [59, 130, 246] },
        })
      } catch (autoTableError) {
        console.warn('autoTable failed, using fallback approach:', autoTableError)
        
        // Fallback: Add text manually
        let yPosition = analysisType !== 'remaining-flats' ? 65 : 55
        
        // Add headers
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        tableColumns.forEach((col, index) => {
          doc.text(col, 20 + (index * 35), yPosition)
        })
        
        // Add data rows
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        yPosition += 10
        
        tableRows.forEach((row, rowIndex) => {
          row.forEach((cell, cellIndex) => {
            const xPosition = 20 + (cellIndex * 35)
            const currentY = yPosition + (rowIndex * 8)
            if (currentY < 280) { // Avoid going off page
              doc.text(String(cell).substring(0, 15), xPosition, currentY)
            }
          })
        })
      }
      
      // Save the PDF
      const fileName = `vargani-report-${new Date().toISOString().split('T')[0]}.pdf`
      doc.save(fileName)
      
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please check the console for details.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Data Analysis Dashboard</h1>
        <p className="text-gray-600 mb-6">
          Generate reports and analyze collection data by building, date, or identify missing entries.
        </p>

        {/* Analysis Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Analysis Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Analysis Type *
              </label>
              <select
                {...register('analysisType', { required: 'Analysis type is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
              >
                <option value="" className="text-gray-500">Select Analysis Type</option>
                <option value="date-building" className="text-gray-900 font-medium">By Date & Building</option>
                <option value="building-only" className="text-gray-900 font-medium">By Building Only</option>
                <option value="remaining-flats" className="text-gray-900 font-medium">Remaining Flats Report</option>
              </select>
              {errors.analysisType && (
                <p className="mt-1 text-sm text-red-600">{errors.analysisType.message}</p>
              )}
            </div>

            {/* Building Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Building Number *
              </label>
              <select
                {...register('buildingNo', { required: 'Building number is required' })}
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

            {/* Date (only for date-building analysis) */}
            {analysisType === 'date-building' && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  {...register('date', { 
                    required: analysisType === 'date-building' ? 'Date is required' : false 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Generate Analysis
                </>
              )}
            </button>

            {receipts.length > 0 && (
              <button
                type="button"
                onClick={generatePDF}
                className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Results */}
      {receipts.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Analysis Results</h2>
            {analysisType !== 'remaining-flats' && (
              <div className="text-lg font-semibold text-green-600">
                Total Amount: ₹{totalAmount.toFixed(2)}
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Building No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Flat No
                  </th>
                  {analysisType !== 'remaining-flats' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resident Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {analysisType === 'remaining-flats' ? 'Status' : 'Date & Time'}
                  </th>
                  {canEdit && analysisType !== 'remaining-flats' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {receipts.map((receipt, index) => (
                  <tr key={receipt.id || index} className={analysisType === 'remaining-flats' ? 'bg-red-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {receipt.buildingNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {receipt.flatNo}
                    </td>
                    {analysisType !== 'remaining-flats' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {editingId === receipt.id ? (
                          <input
                            type="number"
                            step="0.01"
                            value={editForm.amount}
                            onChange={(e) => setEditForm({...editForm, amount: e.target.value})}
                            className="w-20 px-2 py-1 border border-gray-300 rounded"
                          />
                        ) : (
                          `₹${Number(receipt.amount).toFixed(2)}`
                        )}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {editingId === receipt.id ? (
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                          className="w-32 px-2 py-1 border border-gray-300 rounded"
                        />
                      ) : (
                        receipt.name || receipt.resident?.name || 'N/A'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {analysisType === 'remaining-flats' 
                        ? <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">No Receipt</span>
                        : new Date(receipt.dateTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
                      }
                    </td>
                    {canEdit && analysisType !== 'remaining-flats' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {editingId === receipt.id ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => saveEdit(receipt.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Save"
                            >
                              <Save className="h-4 w-4" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="text-gray-600 hover:text-gray-900"
                              title="Cancel"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => startEdit(receipt)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteReceipt(receipt.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {receipts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No data found for the selected criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
