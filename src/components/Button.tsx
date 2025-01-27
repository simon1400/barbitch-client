'use client'

import Link from 'next/link'

interface ButtonProps {
  text: string
  href: string
  inverse?: boolean
  small?: boolean
  blank?: boolean
  className?: string
  onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
}

const Button = ({
  text,
  href,
  inverse = false,
  small = false,
  blank = false,
  className = '',
  onClick,
}: ButtonProps) => {
  const baseClasses = 'inline-block border-0 text-white uppercase text-nowrap duration-200'
  const sizeClasses = small ? 'py-3.5 px-6.5 lg:py-3 lg:px-5' : 'py-3.5 px-6.5 lg:py-4.5 lg:px-11.5'
  const colorClasses = inverse ? 'bg-primary hover:text-accent' : 'bg-accent hover:text-primary'
  const combinedClasses = `${baseClasses} ${sizeClasses} ${colorClasses} ${className}`

  return (
    <Link
      type={'button'}
      href={href}
      target={blank ? '_blank' : '_self'}
      className={combinedClasses}
      onClick={onClick}
    >
      {text}
    </Link>
  )
}

export default Button
