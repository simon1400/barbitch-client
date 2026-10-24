import { LoaderCircle } from 'lucide-react'

interface ButtonProps {
  text: string
  href: string
  inverse?: boolean
  white?: boolean
  // Obrysové tlačítko (bílý rámeček 3px, průhledné pozadí) — na tmavém pozadí.
  outline?: boolean
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
  outline = false,
  small = false,
  blank = false,
  className = '',
  id = '',
  onClick,
  loading,
}: ButtonProps) => {
  const borderClasses = outline ? 'border-[3px] border-solid border-white' : 'border-0'
  const baseClasses = `inline-block ${borderClasses} uppercase text-nowrap duration-200 text-center`
  const textClasses = white && !inverse && !outline ? 'text-accent' : 'text-white'
  const cursorClasses = loading ? 'cursor-wait' : 'cursor-pointer'
  // Rámeček 3px se počítá do výšky (border-box) — proto menší padding.
  const sizeClasses = small
    ? 'py-3.5 px-6.5 lg:py-3 lg:px-5 text-resXs'
    : outline
      ? 'py-[11px] px-[18px] lg:py-[15px] lg:px-8 text-xs h-[48px] md:h-[57px]'
      : 'py-3.5 px-6.5 lg:py-4.5 lg:px-11.5 text-xs h-[48px] min-w-[139px] md:h-[57px] md:min-w-[177px]'
  const colorClasses = outline
    ? 'bg-transparent hover:bg-white hover:text-accent'
    : inverse
      ? 'bg-primary hover:text-accent'
      : white
        ? 'bg-white text-accent hover:text-primary'
        : 'bg-accent hover:text-primary'
  const combinedClasses = `${baseClasses} ${sizeClasses} ${colorClasses} ${className} ${textClasses} ${cursorClasses}`

  return (
    <a
      type={'button'}
      href={href}
      // `rel` u odkazů do nového okna: bez `noopener` má cílová stránka přístup
      // k `window.opener`. `_self` je výchozí chování, není ho třeba psát.
      target={blank ? '_blank' : undefined}
      rel={blank ? 'noopener noreferrer' : undefined}
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
