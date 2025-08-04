'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Search, Users, Edit, Trash2, X } from 'lucide-react'

const residentSchema = z.object({
  buildingNo: z.string().min(1, 'Building number is required'),
  flatNo: z.string().min(1, 'Flat number is required'),
  name: z.string().min(1, 'Name is required'),
  contactNo: z.string().optional(),
})

type ResidentFormData = z.infer<typeof residentSchema>

interface Resident {
  id: number
  buildingNo: string
  flatNo: string
  name: string
  contactNo: string | null
  createdAt: string
}

export default function ResidentsPage() {
  const [residents, setResidents] = useState<Resident[]>([])
  const [filteredResidents, setFilteredResidents] = useState<Resident[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingResident, setEditingResident] = useState<Resident | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResidentFormData>({
    resolver: zodResolver(residentSchema),
  })

  // Fetch residents on component mount
  useEffect(() => {
    fetchResidents()
  }, [])

  // Filter residents based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredResidents(residents)
    } else {
      const filtered = residents.filter(resident =>
        resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resident.buildingNo.includes(searchTerm) ||
        resident.flatNo.includes(searchTerm) ||
        (resident.contactNo && resident.contactNo.includes(searchTerm))
      )
      setFilteredResidents(filtered)
    }
  }, [searchTerm, residents])

  const fetchResidents = async () => {
    try {
      const response = await fetch('/api/residents')
      if (response.ok) {
        const data = await response.json()
        setResidents(data)
      } else {
        alert('Failed to fetch residents')
      }
    } catch (error) {
      console.error('Error fetching residents:', error)
      alert('Error fetching residents')
    }
  }

  const onSubmit = async (data: ResidentFormData) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/residents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        alert('Resident added successfully!')
        reset()
        setShowAddForm(false)
        fetchResidents() // Refresh the list
      } else {
        const errorData = await response.json()
        alert(`Error: ${errorData.error || 'Failed to add resident'}`)
      }
    } catch (error) {
      console.error('Error adding resident:', error)
      alert('Error adding resident. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (resident: Resident) => {
    setEditingResident(resident)
    reset({
      buildingNo: resident.buildingNo,
      flatNo: resident.flatNo,
      name: resident.name,
      contactNo: resident.contactNo || '',
    })
  }

  const handleUpdate = async (data: ResidentFormData) => {
    if (!editingResident) return
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/residents', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingResident.id,
          ...data,
        }),
      })

      if (response.ok) {
        alert('Resident updated successfully!')
        reset()
        setEditingResident(null)
        fetchResidents() // Refresh the list
      } else {
        const errorData = await response.json()
        alert(`Error: ${errorData.error || 'Failed to update resident'}`)
      }
    } catch (error) {
      console.error('Error updating resident:', error)
      alert('Error updating resident. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/residents?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('Resident deleted successfully!')
        setShowDeleteConfirm(null)
        fetchResidents() // Refresh the list
      } else {
        const errorData = await response.json()
        alert(`Error: ${errorData.error || 'Failed to delete resident'}`)
      }
    } catch (error) {
      console.error('Error deleting resident:', error)
      alert('Error deleting resident. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const groupedResidents = filteredResidents.reduce((acc, resident) => {
    const building = resident.buildingNo
    if (!acc[building]) {
      acc[building] = []
    }
    acc[building].push(resident)
    return acc
  }, {} as Record<string, Resident[]>)

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Resident Management</h1>
            <p className="text-gray-600">
              Manage building residents and their contact information.
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Resident
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, building, flat, or contact number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
            />
          </div>
        </div>

        {/* Add/Edit Resident Form */}
        {(showAddForm || editingResident) && (
          <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingResident ? 'Edit Resident' : 'Add New Resident'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditingResident(null)
                  setShowAddForm(false)
                  reset()
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit(editingResident ? handleUpdate : onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  Building Number *
                </label>
                <input
                  type="text"
                  {...register('buildingNo')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                  placeholder="e.g., A1, B2"
                />
                {errors.buildingNo && (
                  <p className="mt-1 text-sm text-red-600">{errors.buildingNo.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  Flat Number *
                </label>
                <input
                  type="text"
                  {...register('flatNo')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                  placeholder="e.g., 101, 202"
                />
                {errors.flatNo && (
                  <p className="mt-1 text-sm text-red-600">{errors.flatNo.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  Resident Name *
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                  placeholder="Full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  Contact Number
                </label>
                <input
                  type="tel"
                  {...register('contactNo')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                  placeholder="Phone number"
                />
              </div>

              <div className="md:col-span-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingResident(null)
                    setShowAddForm(false)
                    reset()
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading ? (editingResident ? 'Updating...' : 'Adding...') : (editingResident ? 'Update Resident' : 'Add Resident')}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Residents List */}
      <div className="space-y-6">
        {Object.keys(groupedResidents).length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No residents found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by adding your first resident.'}
              </p>
            </div>
          </div>
        ) : (
          Object.keys(groupedResidents)
            .sort()
            .map(buildingNo => (
              <div key={buildingNo} className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    Building {buildingNo}
                    <span className="ml-2 text-sm text-gray-500">
                      ({groupedResidents[buildingNo].length} residents)
                    </span>
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Flat No
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Resident Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact Number
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Added Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {groupedResidents[buildingNo]
                        .sort((a, b) => Number(a.flatNo) - Number(b.flatNo))
                        .map(resident => (
                          <tr key={resident.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {resident.flatNo}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {resident.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {resident.contactNo || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(resident.createdAt).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEdit(resident)}
                                  className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                  title="Edit resident"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => setShowDeleteConfirm(resident.id)}
                                  className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                  title="Delete resident"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
        )}
      </div>

      {/* Summary */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{residents.length}</div>
            <div className="text-sm text-gray-600">Total Residents</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{Object.keys(groupedResidents).length}</div>
            <div className="text-sm text-gray-600">Total Buildings</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {searchTerm ? filteredResidents.length : residents.length}
            </div>
            <div className="text-sm text-gray-600">
              {searchTerm ? 'Filtered Results' : 'Active Residents'}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-3">Delete Resident</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this resident? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-center space-x-3 mt-4">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  disabled={isLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                >
                  {isLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
