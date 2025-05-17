/* eslint-disable sonarjs/no-globals-shadowing */
'use client'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div
      className={'min-h-screen flex flex-col items-center justify-center text-center py-20 px-4'}
    >
      <h1 className={'text-4xl font-bold mb-4 text-red-600'}>{'Došlo k chybě'}</h1>
      <p className={'mb-6'}>{error.message}</p>
      <button className={'bg-primary text-white px-6 py-2 rounded'} onClick={() => reset()}>
        {'Zkusit znovu'}
      </button>
    </div>
  )
}
