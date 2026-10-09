'use client'

import { attemptChunkReload, isChunkLoadError } from 'lib/chunkRecovery'
import { reportClientError } from 'lib/errorReporter'
import { useEffect } from 'react'

// Промис отклонён не ошибкой. JSON.stringify давал в журнал «{"isTrusted":true}»
// (событие) и «{}» (DOMException и т. п.) — по ним не понять, что упало. Пишем
// тип события и элемент с адресом: «Event "error" on <SCRIPT src=…gtm.js>».
function describeNonError(reason: object): string {
  if (typeof Event !== 'undefined' && reason instanceof Event) {
    const target = reason.target as (Element & { src?: string; href?: string }) | null
    let where = target?.constructor?.name || 'unknown target'
    if (target && typeof Element !== 'undefined' && target instanceof Element) {
      const url = target.src || target.href || target.getAttribute('src') || ''
      const src = url ? ` src=${url}` : ''
      where = `<${target.tagName}${src}>`
    }
    return `${reason.constructor?.name || 'Event'} "${reason.type}" on ${where}`.slice(0, 500)
  }
  const named = reason as { name?: unknown; message?: unknown }
  const ctor = reason.constructor?.name || Object.prototype.toString.call(reason)
  if (typeof named.name === 'string' || typeof named.message === 'string') {
    return `${ctor}: ${String(named.name ?? '')} ${String(named.message ?? '')}`
      .trim()
      .slice(0, 500)
  }
  let json = ''
  try {
    json = JSON.stringify(reason)
  } catch {
    /* ignore */
  }
  const body = json && json !== '{}' ? json : `keys=[${Object.keys(reason).join(',')}]`
  return `${ctor} ${body}`.slice(0, 500)
}

export default function ErrorReporter() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (isChunkLoadError(event.error) || isChunkLoadError(event.message)) {
        // Stale-deploy chunk failure: reload once to pull the fresh build.
        if (attemptChunkReload()) return
      }
      reportClientError({
        message: event.message || event.error?.message || 'Unknown error',
        stack: event.error?.stack,
        source: 'window-error',
        url: event.filename || window.location.href,
      })
    }

    const handleRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason
      if (isChunkLoadError(reason)) {
        if (attemptChunkReload()) return
      }
      let message = 'Unhandled promise rejection'
      let stack: string | undefined
      if (reason instanceof Error) {
        message = reason.message || message
        stack = reason.stack
      } else if (typeof reason === 'string') {
        message = reason
      } else if (reason && typeof reason === 'object') {
        message = describeNonError(reason)
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
