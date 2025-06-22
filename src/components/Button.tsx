import { LoaderCircle } from 'lucide-react'

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
  loading?: boolean
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
  loading,
}: ButtonProps) => {
  const baseClasses = `inline-block border-0 uppercase text-nowrap duration-200`
  const textClasses = white && !inverse ? 'text-accent' : 'text-white'
  const cursorClasses = loading ? 'cursor-wait' : 'cursor-pointer'
  const sizeClasses = small
    ? 'py-3.5 px-6.5 lg:py-3 lg:px-5 text-resXs'
    : 'py-3.5 px-6.5 lg:py-4.5 lg:px-11.5 text-xs h-[48px] min-w-[139px] md:h-[57px] md:min-w-[177px]'
  const colorClasses = inverse
    ? 'bg-primary hover:text-accent'
    : white
      ? 'bg-white text-accent hover:text-primary'
      : 'bg-accent hover:text-primary'
  const combinedClasses = `${baseClasses} ${sizeClasses} ${colorClasses} ${className} ${textClasses} ${cursorClasses}`

  return (
    <a
      type={'button'}
      href={href}
      target={blank ? '_blank' : '_self'}
      className={combinedClasses}
      id={id}
      onClick={onClick}
    >
      {!loading && text}
      {loading && (
        <span className={'flex items-center justify-center h-full'}>
          <LoaderCircle className={'animate-spin text-blue-500 w-8 h-8 stroke-white'} />
        </span>
      )}
    </a>
  )
}

export default Button
