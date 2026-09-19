'use client'
import { captureAttribution } from 'lib/attribution'
import { useEffect } from 'react'

// Запоминает, откуда клиент пришёл на сайт (метки URL + referrer), — источник брони (s200).
// Один раз на загрузку страницы: переходы внутри сайта новым заходом не считаются.
const AttributionCapture = () => {
  useEffect(() => {
    captureAttribution()
  }, [])

  return null
}

export default AttributionCapture
