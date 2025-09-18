'use client'

import { useState } from 'react'
import { Button } from './button'
import { Phone, Loader2 } from 'lucide-react'

interface CallButtonProps {
  leadId: string
  leadName: string
  disabled?: boolean
  size?: 'sm' | 'default' | 'lg'
  variant?: 'default' | 'outline' | 'ghost'
}

export function CallButton({
  leadId,
  leadName,
  disabled = false,
  size = 'sm',
  variant = 'outline'
}: CallButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleCall = async () => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/calls/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leadId,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Show success message
        alert(`Call initiated for ${leadName}. Call ID: ${data.callId}`)
      } else {
        // Show error message
        alert(`Failed to initiate call: ${data.error}`)
      }
    } catch (error) {
      console.error('Error initiating call:', error)
      alert('Failed to initiate call. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCall}
      disabled={disabled || isLoading}
      className="flex items-center space-x-1"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Phone className="h-4 w-4" />
      )}
      {size !== 'sm' && <span>{isLoading ? 'Calling...' : 'Call'}</span>}
    </Button>
  )
}