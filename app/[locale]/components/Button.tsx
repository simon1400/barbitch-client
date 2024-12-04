'use client'

import Link from 'next/link'

const Button = ({
  text,
  href,
  inverse = false,
  className,
  small = false,
  blank = false,
}: {
  text: string
  href: string
  inverse?: boolean
  small?: boolean
  blank?: boolean
  className?: string
}) => {
  return (
    <Link
      type={'button'}
      target={blank ? '_blank' : '_self'}
      className={`${className} ${small ? 'lg:py-3 lg:px-5' : 'lg:py-4.5 lg:px-11.5'} py-3.5 px-6.5 inline-block border-0 text-white  text-xss lg:text-xs uppercase text-nowrap duration-200 ${inverse ? 'bg-primary hover:text-accent' : 'bg-accent hover:text-primary'}`}
      href={href}
    >
      {text}
    </Link>
  )
}

export default Button
