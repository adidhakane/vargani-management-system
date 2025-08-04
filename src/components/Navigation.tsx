'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Receipt, BarChart3, Users, FileText, LogIn, LogOut, UserPlus, Settings } from 'lucide-react'

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
    <nav className="bg-blue-600 shadow-lg">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Receipt className="h-8 w-8 text-white" />
              <span className="ml-2 text-xl font-bold text-white">
                Vargani Management
              </span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? 'border-blue-200 text-white'
                        : 'border-transparent text-blue-100 hover:border-blue-300 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-1" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
          
          {/* Auth buttons */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {status === 'loading' ? (
              <div className="text-white">Loading...</div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <span className="text-white text-sm">
                  Welcome, {session.user.name}
                  {session.user.role === 'admin' && <span className="ml-1 text-blue-200">(Admin)</span>}
                </span>
                <button
                  onClick={() => signOut()}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center px-3 py-1 border border-blue-300 text-sm font-medium rounded-md text-white hover:bg-blue-700"
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive
                    ? 'bg-blue-700 border-blue-200 text-white'
                    : 'border-transparent text-blue-100 hover:bg-blue-700 hover:border-blue-300 hover:text-white'
                }`}
              >
                <div className="flex items-center">
                  <Icon className="h-4 w-4 mr-2" />
                  {item.name}
                </div>
              </Link>
            )
          })}
        </div>
        
        {/* Mobile auth section */}
        <div className="pt-4 pb-3 border-t border-blue-700">
          {session ? (
            <div className="px-4 space-y-3">
              <div className="text-white text-sm">
                Welcome, {session.user.name}
                {session.user.role === 'admin' && <span className="ml-1 text-blue-200">(Admin)</span>}
              </div>
              <button
                onClick={() => signOut()}
                className="w-full text-left px-3 py-2 text-blue-100 hover:text-white hover:bg-blue-700 rounded"
              >
                <LogOut className="h-4 w-4 mr-2 inline" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="px-4 space-y-2">
              <Link
                href="/auth/signin"
                className="block px-3 py-2 text-blue-100 hover:text-white hover:bg-blue-700 rounded"
              >
                <LogIn className="h-4 w-4 mr-2 inline" />
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="block px-3 py-2 text-blue-100 hover:text-white hover:bg-blue-700 rounded"
              >
                <UserPlus className="h-4 w-4 mr-2 inline" />
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
