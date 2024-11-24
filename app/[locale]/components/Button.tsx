'use client'

import Link from 'next/link'

const Button = ({
  text,
  href,
  inverse = false,
  className,
}: {
  text: string
  href: string
  inverse?: boolean
  className?: string
}) => {
  return (
    <Link
      type={'button'}
      className={`${className} inline-block border-0 text-white py-3.5 px-6.5 lg:py-4.5 lg:px-11.5 text-xss lg:text-xs uppercase text-nowrap hover:bg-white hover:text-primary ${inverse ? 'bg-primary' : 'bg-accent'}`}
      href={href}
    >
      {text}
    </Link>
  )
}

export default Button
