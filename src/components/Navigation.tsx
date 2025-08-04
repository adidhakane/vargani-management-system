'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { Receipt, BarChart3, Users, FileText, LogIn, LogOut, UserPlus, Settings, Menu, X } from 'lucide-react'

const publicNavigation = [
  { name: 'Analysis Dashboard', href: '/dashboard', icon: BarChart3 },
]

const protectedNavigation = [
  { name: 'Receipt Entry', href: '/receipt-entry', icon: Receipt },
  { name: 'Resident Management', href: '/residents', icon: Users },
  { name: 'Reports', href: '/reports', icon: FileText },
]

const adminNavigation = [
  { name: 'User Management', href: '/admin/users', icon: Settings },
]

export default function Navigation() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const getAvailableNavigation = () => {
    const nav = [...publicNavigation]
    
    if (session?.user && (session.user.role === 'approved' || session.user.role === 'admin')) {
      nav.unshift(...protectedNavigation)
    }
    
    if (session?.user?.role === 'admin') {
      nav.push(...adminNavigation)
    }
    
    return nav
  }

  const navigation = getAvailableNavigation()

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-soft">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center group">
              <div className="relative">
                <Receipt className="h-8 w-8 text-blue-600 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                <div className="absolute -inset-1 bg-blue-100 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Vargani Management
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden sm:ml-8 sm:flex sm:space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 shadow-sm'
                        : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
                    }`}
                  >
                    <Icon className={`h-4 w-4 mr-2 transition-all duration-200 ${
                      isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'
                    }`} />
                    {item.name}
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
          
          {/* Auth Section */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {status === 'loading' ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                <span className="text-gray-600 text-sm">Loading...</span>
              </div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-3 py-1 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {session.user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
                    {session.user.role === 'admin' && (
                      <p className="text-xs text-blue-600 font-medium">Administrator</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => signOut()}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile menu panel */}
        {isMobileMenuOpen && (
          <div className="sm:hidden animate-fadeIn">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`group flex items-center px-3 py-2 text-base font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 shadow-sm'
                        : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
                    }`}
                  >
                    <Icon className={`h-5 w-5 mr-3 transition-all duration-200 ${
                      isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'
                    }`} />
                    {item.name}
                  </Link>
                )
              })}
              
              {/* Mobile Auth Section */}
              <div className="pt-4 pb-3 border-t border-gray-200">
                {status === 'loading' ? (
                  <div className="flex items-center px-3 py-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                    <span className="text-gray-600 text-sm ml-3">Loading...</span>
                  </div>
                ) : session ? (
                  <div className="space-y-3">
                    <div className="flex items-center px-3 py-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {session.user.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-base font-medium text-gray-900">{session.user.name}</p>
                        {session.user.role === 'admin' && (
                          <p className="text-sm text-blue-600 font-medium">Administrator</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        signOut()
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/auth/signin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    >
                      <LogIn className="h-5 w-5 mr-3" />
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full flex items-center px-3 py-2 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg transition-all duration-200"
                    >
                      <UserPlus className="h-5 w-5 mr-3" />
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
