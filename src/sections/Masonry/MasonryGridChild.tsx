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
      className={className}
      columnsCountBreakPoints={{ 350: sm || 2, 750: 2, 900: 3 }}
    >
      <Masonry gutter={'20px'}>{children}</Masonry>
    </ResponsiveMasonry>
  )
}
export default MasonryGridChild
