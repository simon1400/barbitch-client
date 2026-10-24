'use client'
import { useAppContext } from 'context/AppContext'
import { LogoIcon } from 'icons/Logo'
import { useParams, usePathname } from 'next/navigation'

import { isDarkPage, isHalloweenHome } from './darkPage'

const LogoWrap = ({ halloween }: { halloween: boolean }) => {
  const params = useParams()
  const pathname = usePathname()
  const darkPage = isDarkPage(pathname) || isHalloweenHome(pathname, halloween)
  const { menu } = useAppContext()
  const fill = menu ? 'fill-primary' : params?.post || darkPage ? 'fill-white' : 'fill-accent'
  return (
    <div>
      <a
        href={'/'}
        className={'block max-w-[205px] lg:max-w-[290px]'}
        aria-label={'Přejít na domovskou stránku'}
      >
        <LogoIcon className={`w-full ${fill}`} />
      </a>
    </div>
  )
}

export default LogoWrap
