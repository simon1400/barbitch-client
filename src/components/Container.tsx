import type { ReactNode } from 'react'

export const Container = ({
  children,
  size,
  className = '',
}: {
  children: ReactNode | ReactNode[]
  className?: string
  size: 'sm' | 'md' | 'lg' | 'xl'
}) => {
  const widths = {
    sm: `mx-auto w-full max-w-[600px] px-4 ${className}`,
    md: `mx-auto w-full max-w-[800px] px-4 ${className}`,
    lg: `mx-auto w-full max-w-[900px] px-4 ${className}`,
    xl: `mx-auto w-full max-w-[1440px] px-4 ${className}`,
  }

  return <div className={widths[size]}>{children}</div>
}
