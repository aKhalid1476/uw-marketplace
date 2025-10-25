/**
 * Send Message Form Component
 *
 * Form for sending messages with typing indicators
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface SendMessageFormProps {
  onSend: (content: string) => Promise<void>
  onTyping?: (isTyping: boolean) => void
  disabled?: boolean
  placeholder?: string
}

export function SendMessageForm({
  onSend,
  onTyping,
  disabled = false,
  placeholder = 'Type a message...',
}: SendMessageFormProps) {
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  // Handle typing indicator
  const handleInput = (value: string) => {
    setMessage(value)

    if (onTyping) {
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      // Set typing to true
      onTyping(true)

      // Set timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false)
      }, 1000)
    }
  }

  // Handle send
  const handleSend = async () => {
    const trimmedMessage = message.trim()
    if (!trimmedMessage || sending) return

    setSending(true)
    try {
      await onSend(trimmedMessage)
      setMessage('')

      // Stop typing indicator
      if (onTyping) {
        onTyping(false)
      }

      // Focus textarea
      textareaRef.current?.focus()
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setSending(false)
    }
  }

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="flex items-end gap-2">
        {/* Attachment button (future feature) */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="flex-shrink-0 text-gray-500 hover:text-gray-700"
          disabled={disabled}
          title="Attach file (coming soon)"
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        {/* Message input */}
        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => handleInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || sending}
            className="min-h-[44px] max-h-32 resize-none border-2 focus:border-purple-400 focus:ring-purple-400"
            rows={1}
          />
          <p className="text-xs text-gray-500 mt-1">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>

        {/* Send button */}
        <Button
          type="button"
          onClick={handleSend}
          disabled={!message.trim() || disabled || sending}
          className={cn(
            'flex-shrink-0 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700',
            (!message.trim() || disabled || sending) && 'opacity-50 cursor-not-allowed'
          )}
          size="icon"
        >
          {sending ? (
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  )
}

/**
 * Compact version for smaller screens
 */
export function SendMessageFormCompact({
  onSend,
  disabled = false,
}: Omit<SendMessageFormProps, 'onTyping' | 'placeholder'>) {
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  const handleSend = async () => {
    const trimmedMessage = message.trim()
    if (!trimmedMessage || sending) return

    setSending(true)
    try {
      await onSend(trimmedMessage)
      setMessage('')
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex gap-2 p-2 border-t border-gray-200 bg-white">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            handleSend()
          }
        }}
        placeholder="Type a message..."
        disabled={disabled || sending}
        className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-400 focus:outline-none"
      />
      <Button
        type="button"
        onClick={handleSend}
        disabled={!message.trim() || disabled || sending}
        size="sm"
        className="bg-purple-600 hover:bg-purple-700"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  )
}
