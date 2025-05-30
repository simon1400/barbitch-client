'use client'
import dynamic from 'next/dynamic'

const MasonryGridChild = dynamic(() => import('./MasonryGridChild'), { ssr: false })

export const MasonryGrid = ({
  children,
  sm,
  className = '',
}: {
  children: React.ReactNode[]
  sm?: number
  className?: string
}) => {
  return <MasonryGridChild {...{ sm, className }}>{children}</MasonryGridChild>
}
