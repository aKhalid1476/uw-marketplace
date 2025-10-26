/**
 * Footer Component
 *
 * Global footer with hackathon info and links
 */

import Link from 'next/link'
import { Package, Github, Mail, Heart } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-b from-white to-purple-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-2 rounded-lg group-hover:shadow-lg transition-shadow">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  UW Marketplace
                </h3>
                <p className="text-xs text-gray-600">For UWaterloo Students</p>
              </div>
            </Link>
            <p className="text-sm text-gray-600 mb-4 max-w-md">
              A secure and convenient platform for UWaterloo students to buy and sell items
              within the campus community. Powered by AI for smart pricing and descriptions.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Built with</span>
              <Heart className="h-4 w-4 text-red-500 fill-red-500" />
              <span>by a fellow Warrior</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/browse"
                  className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
                >
                  Browse Listings
                </Link>
              </li>
              <li>
                <Link
                  href="/listings/create"
                  className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
                >
                  Sell an Item
                </Link>
              </li>
              <li>
                <Link
                  href="/chat"
                  className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
                >
                  Messages
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
                >
                  My Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/safety"
                  className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
                >
                  Safety Tips
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-500">
                &copy; {currentYear} UW Marketplace. All rights reserved.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-600 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="mailto:support@uwmarketplace.ca"
                className="text-gray-400 hover:text-purple-600 transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Hackathon Badge */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
              <span className="text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Built for CalHacks 12.0
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
