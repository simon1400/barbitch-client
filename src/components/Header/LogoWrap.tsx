'use client'
import { useAppContext } from 'context/AppContext'
import { LogoIcon } from 'icons/Logo'
import { useParams, usePathname } from 'next/navigation'

const LogoWrap = () => {
  const params = useParams()
  const pathname = usePathname()
  const bookPage = pathname.includes('/book')
  const { menu } = useAppContext()
  const fill = menu ? 'fill-primary' : params?.post || bookPage ? 'fill-white' : 'fill-accent'
  return (
    <div>
      <a
        href={'/'}
        className={'block max-w-[205px] lg:max-w-[290px]'}
        aria-label={'Перейти на главную страницу'}
      >
        <LogoIcon className={`w-full ${fill}`} />
      </a>
    </div>
  )
}

export default LogoWrap
