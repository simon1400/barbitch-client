'use client'

import { useEffect } from 'react'

export default function HideSmartsupp() {
  useEffect(() => {
    const tryHide = () => {
      if (typeof window !== 'undefined' && window.smartsupp?.chat?.hide) {
        window.smartsupp.chat.hide()
      }
    }

    if (document.readyState === 'complete') {
      tryHide()
    } else {
      window.addEventListener('load', tryHide)
    }

    return () => {
      window.removeEventListener('load', tryHide)
    }
  }, [])

  return null
}
