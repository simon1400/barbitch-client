'use client'

import Link from 'next/link'

interface ButtonProps {
  text: string
  href: string
  inverse?: boolean
  white?: boolean
  small?: boolean
  blank?: boolean
  className?: string
  id?: string
  onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
}

const Button = ({
  text,
  href,
  inverse = false,
  white = false,
  small = false,
  blank = false,
  className = '',
  id = '',
  onClick,
}: ButtonProps) => {
  const baseClasses = `inline-block border-0 uppercase text-nowrap duration-200 ${white && !inverse ? 'text-accent' : 'text-white'}`
  const sizeClasses = small
    ? 'py-3.5 px-6.5 lg:py-3 lg:px-5 text-resXs'
    : 'py-3.5 px-6.5 lg:py-4.5 lg:px-11.5 text-xs'
  const colorClasses = inverse
    ? 'bg-primary hover:text-accent'
    : white
      ? 'bg-white text-accent hover:text-primary'
      : 'bg-accent hover:text-primary'
  const combinedClasses = `${baseClasses} ${sizeClasses} ${colorClasses} ${className}`

  return (
    <Link
      type={'button'}
      href={href}
      target={blank ? '_blank' : '_self'}
      className={combinedClasses}
      id={id}
      onClick={onClick}
    >
      {text}
    </Link>
  )
}

export default Button
