'use client'

import { reportClientError } from 'lib/errorReporter'
import { useEffect } from 'react'

export default function ErrorReporter() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      reportClientError({
        message: event.message || event.error?.message || 'Unknown error',
        stack: event.error?.stack,
        source: 'window-error',
        url: event.filename || window.location.href,
      })
    }

    const handleRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason
      let message = 'Unhandled promise rejection'
      let stack: string | undefined
      if (reason instanceof Error) {
        message = reason.message || message
        stack = reason.stack
      } else if (typeof reason === 'string') {
        message = reason
      } else if (reason && typeof reason === 'object') {
        try {
          message = JSON.stringify(reason).slice(0, 500)
        } catch {
          /* ignore */
        }
      }
      reportClientError({ message, stack, source: 'unhandled-rejection' })
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleRejection)
    }
  }, [])

  return null
}
