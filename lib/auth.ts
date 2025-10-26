/**
 * Authentication Utilities
 *
 * This file contains authentication helper functions for:
 * - Generating verification codes
 * - Sending verification emails
 * - Creating and verifying JWT tokens
 * - Managing auth sessions
 */

import { Resend } from 'resend'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import type { User } from '@/types'
import { sendVerificationCodeEmail } from './email-templates'

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY!)

// JWT configuration
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-min-32-characters-long'
)
const JWT_ALGORITHM = 'HS256'
const TOKEN_EXPIRY = '7d' // 7 days
const COOKIE_NAME = 'auth_token'

// Rate limiting store (in production, use Redis)
const verificationAttempts = new Map<string, { count: number; resetAt: number }>()

// =====================================================
// VERIFICATION CODE GENERATION
// =====================================================

/**
 * Generate a random 6-digit verification code
 */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Calculate expiration time for verification code
 * @param minutes - Number of minutes until expiration (default: 10)
 */
export function getCodeExpiration(minutes: number = 10): Date {
  return new Date(Date.now() + minutes * 60 * 1000)
}

// =====================================================
// EMAIL SENDING
// =====================================================

/**
 * Send verification code email using Resend
 * @param email - Recipient email address
 * @param code - 6-digit verification code
 * @returns Promise that resolves when email is sent
 */
export async function sendVerificationEmail(
  email: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Use Resend's testing domain for development
    // Change to your custom domain in production (e.g., 'UW Marketplace <noreply@uwmarketplace.com>')
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'UW Marketplace - Your Verification Code',
      html: sendVerificationCodeEmail(code),
    })

    if (error) {
      console.error('Error sending email:', error)
      return { success: false, error: error.message }
    }

    console.log('Email sent successfully:', data?.id)
    return { success: true }
  } catch (error) {
    console.error('Error sending verification email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// =====================================================
// RATE LIMITING
// =====================================================

/**
 * Check if an email has exceeded rate limit for verification codes
 * @param email - Email address to check
 * @returns true if rate limit exceeded, false otherwise
 */
export function checkRateLimit(email: string): boolean {
  const now = Date.now()
  const attempt = verificationAttempts.get(email)

  // Clean up expired entries
  if (attempt && now > attempt.resetAt) {
    verificationAttempts.delete(email)
    return false
  }

  // Check if limit exceeded (3 codes per hour)
  if (attempt && attempt.count >= 3) {
    return true
  }

  return false
}

/**
 * Record a verification code send attempt
 * @param email - Email address
 */
export function recordAttempt(email: string): void {
  const now = Date.now()
  const oneHour = 60 * 60 * 1000
  const attempt = verificationAttempts.get(email)

  if (!attempt || now > attempt.resetAt) {
    verificationAttempts.set(email, {
      count: 1,
      resetAt: now + oneHour,
    })
  } else {
    attempt.count++
  }
}

/**
 * Get remaining time until rate limit resets
 * @param email - Email address
 * @returns Minutes until reset, or 0 if no limit
 */
export function getRateLimitResetTime(email: string): number {
  const attempt = verificationAttempts.get(email)
  if (!attempt) return 0

  const now = Date.now()
  if (now > attempt.resetAt) return 0

  return Math.ceil((attempt.resetAt - now) / 60000) // Convert to minutes
}

// =====================================================
// JWT TOKEN MANAGEMENT
// =====================================================

/**
 * Create a JWT token for authenticated user
 * @param user - User object
 * @returns JWT token string
 */
export async function createAuthToken(user: User): Promise<string> {
  const token = await new SignJWT({
    userId: user.id,
    email: user.email,
  })
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .setSubject(user.id)
    .sign(JWT_SECRET)

  return token
}

/**
 * Verify and decode a JWT token
 * @param token - JWT token string
 * @returns Decoded payload or null if invalid
 */
export async function verifyToken(token: string): Promise<{
  userId: string
  email: string
} | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)

    return {
      userId: payload.userId as string,
      email: payload.email as string,
    }
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

// =====================================================
// SESSION MANAGEMENT
// =====================================================

/**
 * Set authentication cookie
 * @param token - JWT token
 */
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies()

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

/**
 * Get authentication token from cookie
 * @returns JWT token or null if not found
 */
export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(COOKIE_NAME)
  return cookie?.value || null
}

/**
 * Clear authentication cookie (logout)
 */
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

/**
 * Get current authenticated user from cookie
 * @returns User ID and email, or null if not authenticated
 */
export async function getCurrentUser(): Promise<{
  userId: string
  email: string
} | null> {
  const token = await getAuthToken()
  if (!token) return null

  return verifyToken(token)
}

/**
 * Check if user is authenticated
 * @returns true if authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return user !== null
}

// =====================================================
// VERIFICATION CODE VALIDATION
// =====================================================

/**
 * Validate verification code format
 * @param code - Code to validate
 * @returns true if valid format
 */
export function isValidCodeFormat(code: string): boolean {
  return /^\d{6}$/.test(code)
}

/**
 * Check if verification code is expired
 * @param expiresAt - Expiration timestamp
 * @returns true if expired
 */
export function isCodeExpired(expiresAt: Date | string): boolean {
  const expiration = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt
  return expiration < new Date()
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

/**
 * Hash a verification code for storage (optional security measure)
 * In production, consider hashing codes before storing
 */
export function hashCode(code: string): string {
  // Simple hash for demo - use bcrypt or similar in production
  return Buffer.from(code).toString('base64')
}

/**
 * Generate a random session ID
 */
export function generateSessionId(): string {
  return crypto.randomUUID()
}

/**
 * Sanitize email address
 */
export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim()
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
