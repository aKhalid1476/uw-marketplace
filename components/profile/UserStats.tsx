/**
 * UserStats Component
 *
 * Displays user statistics in a grid layout
 */

'use client'

import { Package, DollarSign, TrendingUp, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { format } from 'date-fns'

interface UserStatsProps {
  stats: {
    totalListings: number
    activeListings: number
    soldListings: number
    totalRevenue: number
    memberSince: string
  }
}

export function UserStats({ stats }: UserStatsProps) {
  const memberSince = format(new Date(stats.memberSince), 'MMMM d, yyyy')

  const statCards = [
    {
      label: 'Total Listings',
      value: stats.totalListings,
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      label: 'Active Listings',
      value: stats.activeListings,
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      label: 'Items Sold',
      value: stats.soldListings,
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      label: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card
            key={index}
            className="p-6 hover:shadow-lg transition-shadow border-2 border-gray-100"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Member Since Card */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-100">
        <div className="flex items-center gap-4">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <Calendar className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Member Since</p>
            <p className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {memberSince}
            </p>
          </div>
        </div>
      </Card>

      {/* Quick Stats Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Profile Summary
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Success Rate</span>
            <span className="text-sm font-semibold text-gray-900">
              {stats.totalListings > 0
                ? ((stats.soldListings / stats.totalListings) * 100).toFixed(0)
                : 0}
              %
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Average Price per Item</span>
            <span className="text-sm font-semibold text-gray-900">
              $
              {stats.soldListings > 0
                ? (stats.totalRevenue / stats.soldListings).toFixed(2)
                : '0.00'}
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-600">Active vs Total</span>
            <span className="text-sm font-semibold text-gray-900">
              {stats.activeListings} / {stats.totalListings}
            </span>
          </div>
        </div>
      </Card>
    </div>
  )
}
