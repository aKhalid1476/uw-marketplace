/**
 * API Testing Script for UW Marketplace
 *
 * This script tests all API endpoints to verify they work correctly.
 * Run with: npm run test-api
 *
 * Prerequisites:
 * - Dev server running on http://localhost:3000
 * - Valid environment variables set
 * - Database seeded with demo data
 */

import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

const BASE_URL = 'http://localhost:3000'
let authToken = ''
let testUserId = ''
let testListingId = ''

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logSuccess(message: string) {
  log(`✅ ${message}`, 'green')
}

function logError(message: string) {
  log(`❌ ${message}`, 'red')
}

function logInfo(message: string) {
  log(`ℹ️  ${message}`, 'blue')
}

function logWarning(message: string) {
  log(`⚠️  ${message}`, 'yellow')
}

function logSection(title: string) {
  console.log('\n' + '='.repeat(60))
  log(`  ${title}`, 'cyan')
  console.log('='.repeat(60) + '\n')
}

// Helper function to make API requests
async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: any; error?: string; status: number }> {
  try {
    const url = `${BASE_URL}${endpoint}`
    const headers: any = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    }

    // Add auth token if available
    if (authToken) {
      headers['Cookie'] = `auth_token=${authToken}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    // Extract auth token from Set-Cookie header if present
    const setCookie = response.headers.get('set-cookie')
    if (setCookie && setCookie.includes('auth_token=')) {
      const match = setCookie.match(/auth_token=([^;]+)/)
      if (match) {
        authToken = match[1]
        logInfo(`Auth token captured: ${authToken.substring(0, 20)}...`)
      }
    }

    const contentType = response.headers.get('content-type')
    let data
    if (contentType?.includes('application/json')) {
      data = await response.json()
    } else {
      data = await response.text()
    }

    return {
      success: response.ok,
      data,
      error: response.ok ? undefined : data.error || 'Request failed',
      status: response.status,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 0,
    }
  }
}

// Test authentication endpoints
async function testAuthentication() {
  logSection('Testing Authentication Endpoints')

  // Test 1: Send verification code
  logInfo('Test 1: Send verification code')
  const testEmail = `test-${Date.now()}@uwaterloo.ca`
  const sendCodeResult = await apiRequest('/api/auth/send-code', {
    method: 'POST',
    body: JSON.stringify({ email: testEmail }),
  })

  if (sendCodeResult.success) {
    logSuccess('Verification code endpoint works')
    logInfo(`Check console for verification code for ${testEmail}`)
  } else {
    logError(`Failed to send verification code: ${sendCodeResult.error}`)
  }

  // Test 2: Login with existing user
  logInfo('Test 2: Login with existing user')
  const loginResult = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'alice.chen@uwaterloo.ca',
      password: 'password123',
    }),
  })

  if (loginResult.success) {
    logSuccess('Login successful')
    if (loginResult.data?.data?.user) {
      testUserId = loginResult.data.data.user.id
      logInfo(`Logged in as: ${loginResult.data.data.user.email}`)
    }
  } else {
    logError(`Login failed: ${loginResult.error}`)
    logWarning('Make sure database is seeded with demo data (npm run seed)')
  }

  // Test 3: Check authentication status
  logInfo('Test 3: Check authentication status')
  const meResult = await apiRequest('/api/auth/me')

  if (meResult.success) {
    logSuccess('Auth check works')
    logInfo(`Current user: ${meResult.data?.data?.user?.email || 'Unknown'}`)
  } else {
    logError(`Auth check failed: ${meResult.error}`)
  }

  return loginResult.success
}

// Test listing endpoints
async function testListings() {
  logSection('Testing Listing Endpoints')

  // Test 1: Get all listings
  logInfo('Test 1: Get all listings')
  const listingsResult = await apiRequest('/api/listings')

  if (listingsResult.success) {
    const count = listingsResult.data?.listings?.length || 0
    logSuccess(`Retrieved ${count} listings`)
    if (count > 0) {
      testListingId = listingsResult.data.listings[0].id
      logInfo(`Sample listing ID: ${testListingId}`)
    }
  } else {
    logError(`Failed to get listings: ${listingsResult.error}`)
  }

  // Test 2: Get user's listings
  logInfo('Test 2: Get user\'s listings')
  const myListingsResult = await apiRequest('/api/listings?user=me')

  if (myListingsResult.success) {
    const count = myListingsResult.data?.listings?.length || 0
    logSuccess(`Retrieved ${count} of user's listings`)
  } else {
    logError(`Failed to get user's listings: ${myListingsResult.error}`)
  }

  // Test 3: Get single listing
  if (testListingId) {
    logInfo('Test 3: Get single listing')
    const singleListingResult = await apiRequest(`/api/listings/${testListingId}`)

    if (singleListingResult.success) {
      logSuccess('Retrieved listing details')
      logInfo(`Title: ${singleListingResult.data?.listing?.title || 'Unknown'}`)
      logInfo(`Price: $${singleListingResult.data?.listing?.price || 0}`)
    } else {
      logError(`Failed to get listing: ${singleListingResult.error}`)
    }
  }

  // Test 4: Create new listing
  logInfo('Test 4: Create new listing')
  const newListing = {
    title: 'Test Listing - API Test',
    description: 'This is a test listing created by the API test script',
    price: 99.99,
    category: 'Electronics',
    image_urls: ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='],
  }

  const createResult = await apiRequest('/api/listings', {
    method: 'POST',
    body: JSON.stringify(newListing),
  })

  if (createResult.success) {
    logSuccess('Listing created successfully')
    logInfo(`New listing ID: ${createResult.data?.data?.listing?.id || 'Unknown'}`)
  } else {
    logError(`Failed to create listing: ${createResult.error}`)
  }

  return listingsResult.success
}

// Test AI endpoints
async function testAI() {
  logSection('Testing AI Endpoints')

  // Test 1: Generate description from image
  logInfo('Test 1: Generate description from base64 image')

  // Small 1x1 red pixel PNG as base64
  const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg=='

  const descriptionResult = await apiRequest('/api/ai/generate-description', {
    method: 'POST',
    body: JSON.stringify({
      imageData: `data:image/png;base64,${testImageBase64}`,
    }),
  })

  if (descriptionResult.success) {
    logSuccess('AI description generated')
    logInfo(`Description: ${descriptionResult.data?.description || descriptionResult.data?.data?.description || 'N/A'}`)
  } else {
    logError(`Failed to generate description: ${descriptionResult.error}`)
    if (descriptionResult.error?.includes('API key')) {
      logWarning('Check your ANTHROPIC_API_KEY environment variable')
    }
  }

  // Test 2: AI price suggestion
  logInfo('Test 2: AI price suggestion')
  const priceResult = await apiRequest('/api/ai/suggest-price', {
    method: 'POST',
    body: JSON.stringify({
      title: 'MacBook Pro 2020',
      category: 'Electronics',
      description: 'Used laptop in good condition',
    }),
  })

  if (priceResult.success) {
    logSuccess('AI price suggested')
    logInfo(`Suggested price: $${priceResult.data?.price || priceResult.data?.data?.price || 'N/A'}`)
  } else {
    logError(`Failed to suggest price: ${priceResult.error}`)
  }

  return descriptionResult.success || priceResult.success
}

// Test chat endpoints
async function testChat() {
  logSection('Testing Chat Endpoints')

  if (!testListingId) {
    logWarning('Skipping chat tests - no test listing available')
    return false
  }

  // Test 1: Get conversations
  logInfo('Test 1: Get conversations')
  const conversationsResult = await apiRequest('/api/chat/conversations')

  if (conversationsResult.success) {
    const count = conversationsResult.data?.data?.conversations?.length || 0
    logSuccess(`Retrieved ${count} conversations`)
  } else {
    logError(`Failed to get conversations: ${conversationsResult.error}`)
  }

  // Test 2: Get messages for a conversation
  if (conversationsResult.data?.data?.conversations?.[0]) {
    const conv = conversationsResult.data.data.conversations[0]
    logInfo('Test 2: Get messages for conversation')
    const messagesResult = await apiRequest(
      `/api/chat/messages?listing_id=${conv.listing_id}&other_user_id=${conv.other_user_id}`
    )

    if (messagesResult.success) {
      const count = messagesResult.data?.data?.messages?.length || 0
      logSuccess(`Retrieved ${count} messages`)
    } else {
      logError(`Failed to get messages: ${messagesResult.error}`)
    }
  }

  return conversationsResult.success
}

// Test profile endpoints
async function testProfile() {
  logSection('Testing Profile Endpoints')

  // Test 1: Get user profile
  logInfo('Test 1: Get user profile')
  const profileResult = await apiRequest(`/api/users/${testUserId}`)

  if (profileResult.success) {
    logSuccess('Profile retrieved')
    logInfo(`Name: ${profileResult.data?.data?.user?.full_name || 'Unknown'}`)
    logInfo(`Listings: ${profileResult.data?.data?.listing_count || 0}`)
  } else {
    logError(`Failed to get profile: ${profileResult.error}`)
  }

  return profileResult.success
}

// Main test runner
async function runTests() {
  console.clear()
  log('\n🧪 UW Marketplace API Test Suite\n', 'cyan')
  log('Testing all API endpoints...\n', 'blue')

  const results = {
    auth: false,
    listings: false,
    ai: false,
    chat: false,
    profile: false,
  }

  try {
    // Run tests sequentially
    results.auth = await testAuthentication()

    if (results.auth) {
      results.listings = await testListings()
      results.ai = await testAI()
      results.chat = await testChat()
      results.profile = await testProfile()
    } else {
      logWarning('Skipping remaining tests - authentication failed')
    }

    // Print summary
    logSection('Test Summary')

    const testResults = [
      { name: 'Authentication', passed: results.auth },
      { name: 'Listings', passed: results.listings },
      { name: 'AI Features', passed: results.ai },
      { name: 'Chat System', passed: results.chat },
      { name: 'User Profile', passed: results.profile },
    ]

    testResults.forEach((result) => {
      if (result.passed) {
        logSuccess(`${result.name} - PASSED`)
      } else {
        logError(`${result.name} - FAILED`)
      }
    })

    const passedCount = testResults.filter((r) => r.passed).length
    const totalCount = testResults.length
    const passRate = Math.round((passedCount / totalCount) * 100)

    console.log('\n' + '='.repeat(60))
    log(`  Total: ${passedCount}/${totalCount} tests passed (${passRate}%)`, passRate === 100 ? 'green' : 'yellow')
    console.log('='.repeat(60) + '\n')

    if (passRate === 100) {
      logSuccess('All tests passed! 🎉')
    } else {
      logWarning('Some tests failed. Check the output above for details.')
    }

  } catch (error) {
    logError(`Test suite error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    console.error(error)
  }
}

// Run the tests
runTests().catch(console.error)
