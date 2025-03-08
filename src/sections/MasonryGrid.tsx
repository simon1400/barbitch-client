'use client'
import useMasonry from 'helpers/useMasonry'

export const MasonryGrid = ({
  children,
  sm,
  className = '',
}: {
  children: React.ReactNode[]
  sm?: number
  className?: string
}) => {
  const masonryContainer = useMasonry()
  return (
    <div
      ref={masonryContainer}
      className={`grid items-start gap-4 grid-cols-${sm || '2'} md:grid-cols-3 md:gap-6 ${className}`}
    >
      {children}
    </div>
  )
}
