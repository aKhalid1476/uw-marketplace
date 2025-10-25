/**
 * Signup Page
 *
 * Three-step signup flow:
 * 1. Enter email
 * 2. Verify email with code
 * 3. Create password
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, ArrowRight, ArrowLeft, CheckCircle, Loader2, Eye, EyeOff, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState<'email' | 'code' | 'password'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(0)

  // Check if already authenticated
  useEffect(() => {
    checkAuth()
  }, [])

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      const data = await response.json()
      if (data.success) {
        router.push('/browse')
      }
    } catch (err) {
      // Not authenticated
    }
  }

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      })

      const data = await response.json()

      if (data.success) {
        setStep('code')
        setSuccess('Verification code sent! Check your email.')
        setCountdown(60)
      } else {
        setError(data.error || 'Failed to send verification code')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('Send code error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()

    if (code.length !== 6) {
      setError('Please enter a 6-digit code')
      return
    }

    setError(null)
    setSuccess(null)
    setStep('password')
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // Validate password
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          code: code.trim(),
          password,
          full_name: fullName.trim() || undefined,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('Account created successfully! Redirecting...')
        setTimeout(() => {
          router.push('/browse')
          router.refresh()
        }, 1500)
      } else {
        setError(data.error || 'Failed to create account')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('Signup error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (countdown > 0) return
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('New verification code sent!')
        setCountdown(60)
      } else {
        setError(data.error || 'Failed to resend code')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('Resend code error:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStepTitle = () => {
    switch (step) {
      case 'email':
        return 'Create Account'
      case 'code':
        return 'Verify Email'
      case 'password':
        return 'Set Password'
    }
  }

  const getStepDescription = () => {
    switch (step) {
      case 'email':
        return 'Join UW Marketplace with your @uwaterloo.ca email'
      case 'code':
        return `We sent a 6-digit code to ${email}`
      case 'password':
        return 'Create a secure password for your account'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-lg mb-4">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{getStepTitle()}</h1>
          <p className="text-gray-600">{getStepDescription()}</p>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className={`h-2 w-12 rounded-full ${step === 'email' ? 'bg-purple-600' : 'bg-purple-200'}`} />
            <div className={`h-2 w-12 rounded-full ${step === 'code' ? 'bg-purple-600' : step === 'password' ? 'bg-purple-200' : 'bg-gray-200'}`} />
            <div className={`h-2 w-12 rounded-full ${step === 'password' ? 'bg-purple-600' : 'bg-gray-200'}`} />
          </div>
        </div>

        <Card className="p-6 sm:p-8 shadow-lg">
          {/* Step 1: Email Input */}
          {step === 'email' && (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="yourname@uwaterloo.ca"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  You must use a valid @uwaterloo.ca email address
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  {success}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                disabled={loading || !email}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Code...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <div className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-purple-600 hover:text-purple-700 font-medium">
                  Sign in
                </Link>
              </div>
            </form>
          )}

          {/* Step 2: Code Verification */}
          {step === 'code' && (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center text-2xl tracking-widest font-mono"
                  required
                  disabled={loading}
                  maxLength={6}
                  autoFocus
                />
                <p className="text-xs text-gray-500">
                  Enter the 6-digit code sent to your email
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  {success}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                disabled={loading || code.length !== 6}
              >
                Verify Code
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <div className="text-center space-y-2">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={countdown > 0 || loading}
                  className="text-sm text-purple-600 hover:text-purple-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {countdown > 0
                    ? `Resend code in ${countdown}s`
                    : 'Resend verification code'}
                </button>

                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setStep('email')
                      setCode('')
                      setError(null)
                      setSuccess(null)
                    }}
                    className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 mx-auto"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    Use a different email
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Step 3: Password Creation */}
          {step === 'password' && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name (Optional)</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Must be at least 8 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  {success}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                disabled={loading || !password || !confirmPassword}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setStep('code')
                    setPassword('')
                    setConfirmPassword('')
                    setError(null)
                    setSuccess(null)
                  }}
                  className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 mx-auto"
                >
                  <ArrowLeft className="h-3 w-3" />
                  Back to verification
                </button>
              </div>
            </form>
          )}
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            By signing up, you agree to our{' '}
            <Link href="/terms" className="text-purple-600 hover:text-purple-700">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-purple-600 hover:text-purple-700">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
