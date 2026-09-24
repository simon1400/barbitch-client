/* eslint-disable sonarjs/no-globals-shadowing */
'use client'

import { attemptChunkReload, isChunkLoadError } from 'lib/chunkRecovery'
import { reportClientError } from 'lib/errorReporter'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { startTransition, useEffect } from 'react'

// Chyba v krocích rezervace (typicky výpadek engine) — stejná hláška a vzhled,
// jaké dřív kreslily samotné stránky, jen teď se statusem 500 místo 200.
// Obnova po chybějícím chunku a hlášení chyby jako v app/error.tsx.
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter()

  useEffect(() => {
    if (isChunkLoadError(error) && attemptChunkReload()) return
    reportClientError({
      message: error.message || 'Book route error (no message)',
      stack: error.stack,
      source: 'react-error',
    })
  }, [error])

  return (
    <div className={'bg-[#252523] rounded-special-small px-5 py-10 text-center'}>
      <h2 className={'text-xs1 leading-snug mb-5'}>
        {'Rezervační systém je momentálně nedostupný. Zkuste to prosím za chvíli.'}
      </h2>
      <div className={'flex flex-wrap justify-center gap-3'}>
        <button
          type={'button'}
          className={
            'inline-block bg-primary text-white text-xs1 font-bold rounded-special-small px-6 py-3'
          }
          onClick={() =>
            startTransition(() => {
              router.refresh()
              reset()
            })
          }
        >
          {'Zkusit znovu'}
        </button>
        <Link
          className={
            'inline-block border border-[#3C3C3C] text-white text-xs1 font-bold rounded-special-small px-6 py-3'
          }
          href={'/book'}
        >
          {'Zpět na výběr služby'}
        </Link>
      </div>
    </div>
  )
}
