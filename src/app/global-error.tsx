'use client'

import { attemptChunkReload, isChunkLoadError } from 'lib/chunkRecovery'
import { reportClientError } from 'lib/errorReporter'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    if (isChunkLoadError(error) && attemptChunkReload()) return
    reportClientError({
      message: error.message || 'Global error (no message)',
      stack: error.stack,
      source: 'react-error',
    })
  }, [error])

  return (
    <html lang={'cs'}>
      <body>
        <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: 'system-ui, sans-serif' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: 48, fontWeight: 700, color: '#e71e6e', margin: 0 }}>{'Něco se pokazilo'}</h1>
            <p style={{ marginTop: 12, color: '#444' }}>{'Zkuste prosím obnovit stránku.'}</p>
            <button
              onClick={() => reset()}
              style={{ marginTop: 24, padding: '12px 24px', background: '#e71e6e', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}
            >
              {'Zkusit znovu'}
            </button>
          </div>
        </main>
      </body>
    </html>
  )
}
