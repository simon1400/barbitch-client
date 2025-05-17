import { headers } from 'next/headers'
import React from 'react'

const hiddenRoutes = ['/admin']

export function withHiddenRoutes<P extends Record<string, any>>(
  Component: (props: P) => Promise<React.ReactElement> | React.ReactElement,
  customHidden: string[] = [],
) {
  const allHiddenRoutes = [...hiddenRoutes, ...customHidden]

  return async function WrappedComponent(props: P): Promise<React.ReactElement | null> {
    const headersList = await headers()
    const pathname = headersList.get('x-next-pathname') || ''

    let shouldHide = false
    for (let i = 0; i < allHiddenRoutes.length; i++) {
      if (pathname.includes(allHiddenRoutes[i])) {
        shouldHide = true
        break
      }
    }

    if (shouldHide) return null

    return <Component {...props} />
  }
}
