/**
 * Toast Notifications Component
 *
 * Provides toast notification functionality using Sonner
 */

'use client'

import { Toaster as SonnerToaster } from 'sonner'

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      toastOptions={{
        style: {
          background: 'white',
          border: '1px solid #e5e7eb',
        },
        className: 'toast',
      }}
    />
  )
}

export { toast } from 'sonner'
