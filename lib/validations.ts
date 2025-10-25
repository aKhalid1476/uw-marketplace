/**
 * Validation Schemas using Zod
 *
 * This file contains all Zod schemas for form validation throughout the application.
 * These schemas ensure data integrity and provide type-safe validation.
 */

import { z } from 'zod'

// =====================================================
// AUTHENTICATION VALIDATION
// =====================================================

/**
 * Email validation schema
 * Validates UW email addresses (or any valid email)
 */
export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .toLowerCase()
  .trim()

/**
 * UWaterloo email validation schema (strict)
 * Only allows @uwaterloo.ca emails
 */
export const uwEmailSchema = z
  .string()
  .email('Please enter a valid email address')
  .refine(
    (email) => {
      const domain = email.toLowerCase().split('@')[1]
      return domain === 'uwaterloo.ca'
    },
    {
      message: 'Please use a UWaterloo email address (@uwaterloo.ca)',
    }
  )
  .transform((email) => email.toLowerCase().trim())

/**
 * Verification code schema
 * Validates 6-digit verification codes
 */
export const verificationCodeSchema = z
  .string()
  .length(6, 'Verification code must be exactly 6 digits')
  .regex(/^\d{6}$/, 'Verification code must contain only numbers')

/**
 * Email verification request schema
 */
export const emailVerificationRequestSchema = z.object({
  email: uwEmailSchema,
})

/**
 * Email verification submit schema
 */
export const emailVerificationSubmitSchema = z.object({
  email: uwEmailSchema,
  code: verificationCodeSchema,
})

// Type inference from schema
export type EmailVerificationRequest = z.infer<typeof emailVerificationRequestSchema>
export type EmailVerificationSubmit = z.infer<typeof emailVerificationSubmitSchema>

// =====================================================
// USER PROFILE VALIDATION
// =====================================================

/**
 * User profile update schema
 */
export const userProfileUpdateSchema = z.object({
  full_name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim()
    .optional(),
  profile_picture_url: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .nullable(),
})

export type UserProfileUpdate = z.infer<typeof userProfileUpdateSchema>

// =====================================================
// LISTING VALIDATION
// =====================================================

/**
 * Category validation schema
 */
export const categorySchema = z.enum([
  'Electronics',
  'Furniture',
  'Books',
  'Clothing',
  'Tickets',
  'Other',
] as const)

/**
 * Listing status validation schema
 */
export const listingStatusSchema = z.enum([
  'active',
  'sold',
  'deleted',
] as const)

/**
 * Price validation schema
 */
export const priceSchema = z
  .number({
    required_error: 'Price is required',
    invalid_type_error: 'Price must be a number',
  })
  .positive('Price must be greater than 0')
  .max(99999.99, 'Price must be less than $100,000')
  .refine(
    (value) => {
      // Ensure only 2 decimal places
      return /^\d+(\.\d{1,2})?$/.test(value.toString())
    },
    {
      message: 'Price can only have up to 2 decimal places',
    }
  )

/**
 * Create listing schema
 */
export const createListingSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters')
    .trim(),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be less than 2000 characters')
    .trim(),
  price: priceSchema,
  category: categorySchema,
  image_urls: z
    .array(z.string().url('Invalid image URL'))
    .min(1, 'At least one image is required')
    .max(10, 'Maximum 10 images allowed')
    .optional()
    .default([]),
})

export type CreateListingForm = z.infer<typeof createListingSchema>

/**
 * Update listing schema
 */
export const updateListingSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters')
    .trim()
    .optional(),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be less than 2000 characters')
    .trim()
    .optional(),
  price: priceSchema.optional(),
  category: categorySchema.optional(),
  status: listingStatusSchema.optional(),
  image_urls: z
    .array(z.string().url('Invalid image URL'))
    .max(10, 'Maximum 10 images allowed')
    .optional(),
})

export type UpdateListingForm = z.infer<typeof updateListingSchema>

/**
 * Listing filter schema
 */
export const listingFilterSchema = z.object({
  category: categorySchema.optional(),
  min_price: z.number().positive().optional(),
  max_price: z.number().positive().optional(),
  search: z.string().trim().optional(),
  seller_id: z.string().uuid().optional(),
  status: listingStatusSchema.optional(),
})

export type ListingFilters = z.infer<typeof listingFilterSchema>

// =====================================================
// MESSAGE VALIDATION
// =====================================================

/**
 * Send message schema
 */
export const sendMessageSchema = z.object({
  listing_id: z.string().uuid('Invalid listing ID'),
  receiver_id: z.string().uuid('Invalid receiver ID'),
  content: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(1000, 'Message must be less than 1000 characters')
    .trim(),
})

export type SendMessageForm = z.infer<typeof sendMessageSchema>

/**
 * Mark message as read schema
 */
export const markMessageReadSchema = z.object({
  message_id: z.string().uuid('Invalid message ID'),
})

export type MarkMessageRead = z.infer<typeof markMessageReadSchema>

// =====================================================
// IMAGE UPLOAD VALIDATION
// =====================================================

/**
 * Allowed image file types
 */
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

/**
 * Max image file size (5MB)
 */
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB in bytes

/**
 * Image file validation schema
 */
export const imageFileSchema = z
  .instanceof(File)
  .refine(
    (file) => ALLOWED_IMAGE_TYPES.includes(file.type),
    {
      message: 'Only JPEG, PNG, and WebP images are allowed',
    }
  )
  .refine(
    (file) => file.size <= MAX_IMAGE_SIZE,
    {
      message: 'Image size must be less than 5MB',
    }
  )

/**
 * Multiple images upload schema
 */
export const imagesUploadSchema = z
  .array(imageFileSchema)
  .min(1, 'At least one image is required')
  .max(10, 'Maximum 10 images allowed')

export type ImageFile = z.infer<typeof imageFileSchema>
export type ImagesUpload = z.infer<typeof imagesUploadSchema>

// =====================================================
// PAGINATION VALIDATION
// =====================================================

/**
 * Pagination parameters schema
 */
export const paginationSchema = z.object({
  page: z
    .number()
    .int()
    .positive()
    .default(1),
  limit: z
    .number()
    .int()
    .positive()
    .max(100, 'Limit cannot exceed 100')
    .default(20),
})

export type PaginationParams = z.infer<typeof paginationSchema>

// =====================================================
// SEARCH VALIDATION
// =====================================================

/**
 * Search query schema
 */
export const searchQuerySchema = z.object({
  q: z
    .string()
    .min(2, 'Search query must be at least 2 characters')
    .max(100, 'Search query must be less than 100 characters')
    .trim(),
  category: categorySchema.optional(),
  min_price: z.coerce.number().positive().optional(),
  max_price: z.coerce.number().positive().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

export type SearchQuery = z.infer<typeof searchQuerySchema>

// =====================================================
// ID VALIDATION
// =====================================================

/**
 * UUID validation schema
 */
export const uuidSchema = z.string().uuid('Invalid ID format')

/**
 * ID params schema (for route params)
 */
export const idParamsSchema = z.object({
  id: uuidSchema,
})

export type IdParams = z.infer<typeof idParamsSchema>

// =====================================================
// UTILITY VALIDATION FUNCTIONS
// =====================================================

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  return emailSchema.safeParse(email).success
}

/**
 * Validate UW email format
 */
export function isValidUWEmail(email: string): boolean {
  return uwEmailSchema.safeParse(email).success
}

/**
 * Validate verification code format
 */
export function isValidVerificationCode(code: string): boolean {
  return verificationCodeSchema.safeParse(code).success
}

/**
 * Validate price format
 */
export function isValidPrice(price: number): boolean {
  return priceSchema.safeParse(price).success
}

/**
 * Validate UUID format
 */
export function isValidUUID(id: string): boolean {
  return uuidSchema.safeParse(id).success
}

// =====================================================
// CUSTOM VALIDATION HELPERS
// =====================================================

/**
 * Create a safe parser that returns typed data or null
 */
export function safeParse<T>(schema: z.ZodSchema<T>, data: unknown): T | null {
  const result = schema.safeParse(data)
  return result.success ? result.data : null
}

/**
 * Validate and throw on error
 */
export function validateOrThrow<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data)
}

/**
 * Get validation errors as a record
 */
export function getValidationErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {}

  error.errors.forEach((err) => {
    const path = err.path.join('.')
    errors[path] = err.message
  })

  return errors
}
