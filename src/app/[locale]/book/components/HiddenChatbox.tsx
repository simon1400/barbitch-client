'use client'

import { useOnMountUnsafe } from 'helpers/useOnMountUnsaf'

export default function HideSmartsupp() {
  useOnMountUnsafe(() => {
    if (typeof window !== 'undefined' && window.smartsupp) {
      window.smartsupp('chat:hide')
    }
  })

  return null
}
