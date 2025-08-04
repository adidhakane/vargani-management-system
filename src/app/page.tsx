import Link from 'next/link'
import { BarChart3, Receipt, Users, FileText, ArrowRight, CheckCircle, TrendingUp, Shield, Clock } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 opacity-70"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="animate-fadeIn">
              <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
                <span className="text-gradient">Vargani Management</span>
                <br />
                <span className="text-gray-700">Made Simple</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Streamline your building collection management with our powerful, intuitive platform. 
                Track receipts, analyze data, and manage residents with ease.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/dashboard"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                >
                  <BarChart3 className="h-5 w-5 mr-2" />
                  View Dashboard
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
                <Link 
                  href="/auth/signup"
                  className="inline-flex items-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to manage collections
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools you need to efficiently manage building collections and resident data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Receipt,
                title: 'Receipt Management',
                description: 'Easy receipt entry with automatic calculations and IST timezone support.',
                color: 'text-blue-600',
                bgColor: 'bg-blue-100'
              },
              {
                icon: BarChart3,
                title: 'Analytics Dashboard',
                description: 'Powerful insights with building-wise analysis and date filtering.',
                color: 'text-green-600',
                bgColor: 'bg-green-100'
              },
              {
                icon: Users,
                title: 'Resident Management',
                description: 'Complete resident database with building and flat information.',
                color: 'text-purple-600',
                bgColor: 'bg-purple-100'
              },
              {
                icon: FileText,
                title: 'PDF Reports',
                description: 'Generate professional PDF reports for all your analysis needs.',
                color: 'text-orange-600',
                bgColor: 'bg-orange-100'
              }
            ].map((feature, index) => (
              <div key={index} className="group hover-lift bg-white rounded-xl p-6 border border-gray-200 shadow-soft">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${feature.bgColor} mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: TrendingUp, label: 'Buildings Managed', value: '6+' },
              { icon: Users, label: 'Residents Served', value: '249+' },
              { icon: Clock, label: 'Time Saved', value: '90%' }
            ].map((stat, index) => (
              <div key={index} className="text-white">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why choose Vargani Management?
              </h2>
              <div className="space-y-4">
                {[
                  'Real-time receipt tracking and management',
                  'Comprehensive analytics and reporting',
                  'Secure user authentication and role management',
                  'Mobile-responsive design for any device',
                  'Automated PDF generation for reports',
                  'IST timezone support for accurate timestamps'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link 
                  href="/dashboard"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Explore Features
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                      <span className="font-medium">Building 4, Flat 15</span>
                    </div>
                    <span className="text-green-600 font-bold">₹2,500</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <span className="font-medium">Building 5, Flat 22</span>
                    </div>
                    <span className="text-green-600 font-bold">₹3,000</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                      <span className="font-medium">Building 7, Flat 8</span>
                    </div>
                    <span className="text-green-600 font-bold">₹2,800</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to streamline your collection management?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join building administrators who trust Vargani Management for their collection needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth/signup"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              <Shield className="h-5 w-5 mr-2" />
              Sign Up Now
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
            <Link 
              href="/dashboard"
              className="inline-flex items-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              View Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
