'use client'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'

const MasonryGridChild = ({
  children,
  sm,
  className = '',
}: {
  children: React.ReactNode[]
  sm?: number
  className?: string
}) => {
  return (
    <ResponsiveMasonry
      {...{
        className,
        columnsCountBreakPoints: { 350: sm || 2, 750: 2, 900: 3 },
        gutterBreakPoints: { 350: '16px', 750: '16px', 900: '24px' },
      }}
    >
      <Masonry>{children}</Masonry>
    </ResponsiveMasonry>
  )
}
export default MasonryGridChild
