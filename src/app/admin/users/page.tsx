'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Users, CheckCircle, XCircle, Clock } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: 'pending' | 'approved' | 'admin'
  createdAt: string
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const { data: session } = useSession()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      } else {
        setError('Failed to fetch users')
      }
    } catch {
      setError('Error fetching users')
    } finally {
      setIsLoading(false)
    }
  }

  const updateUserRole = async (userId: string, role: string) => {
    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, role }),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUsers(prev => prev.map(user => 
          user.id === userId ? updatedUser : user
        ))
      } else {
        setError('Failed to update user role')
      }
    } catch {
      setError('Error updating user role')
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'admin':
        return <CheckCircle className="h-5 w-5 text-blue-500" />
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />
    }
  }

  const getRoleBadge = (role: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full"
    switch (role) {
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`
      case 'admin':
        return `${baseClasses} bg-blue-100 text-blue-800`
      default:
        return `${baseClasses} bg-yellow-100 text-yellow-800`
    }
  }

  if (session?.user?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600">You don&apos;t have permission to access this page.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading users...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Users className="h-8 w-8 mr-3 text-blue-600" />
            User Management
          </h1>
          <p className="mt-2 text-gray-600">
            Manage user access and permissions for the Vargani Management System
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {users.map((user) => (
            <li key={user.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {getRoleIcon(user.role)}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user.email}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Joined: {new Date(user.createdAt).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={getRoleBadge(user.role)}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                  {user.role !== 'admin' && (
                    <div className="flex space-x-2">
                      {user.role === 'pending' && (
                        <button
                          onClick={() => updateUserRole(user.id, 'approved')}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approve
                        </button>
                      )}
                      {user.role === 'approved' && (
                        <button
                          onClick={() => updateUserRole(user.id, 'pending')}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-yellow-600 hover:bg-yellow-700"
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          Revoke
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600">No users have registered yet.</p>
        </div>
      )}
    </div>
  )
}
