'use client'
import Button from 'components/Button'
import Hamburger from 'components/Header/Hamburger'
import { useAppContext } from 'context/AppContext'
import { useParams, usePathname } from 'next/navigation'
import { useEffect } from 'react'

// Иконка «Můj účet» — силуэт клиентки + фирменная розовая ✦ (стиль кабинета/bitchcard)
const CabinetIcon = () => (
  <svg width={30} height={30} viewBox={'0 0 24 24'} fill={'none'} aria-hidden>
    <circle cx={11} cy={9} r={3.4} stroke={'currentColor'} strokeWidth={1.8} />
    <path
      d={'M4.5 20.2c0-3.4 2.9-5.6 6.5-5.6s6.5 2.2 6.5 5.6'}
      stroke={'currentColor'}
      strokeWidth={1.8}
      strokeLinecap={'round'}
    />
    <path
      d={'M18.6 2.4l.85 2.05 2.05.85-2.05.85-.85 2.05-.85-2.05-2.05-.85 2.05-.85.85-2.05z'}
      className={'fill-primary'}
    />
  </svg>
)

const Buttons = ({ linkToReserve }: { linkToReserve: string }) => {
  const pathname = usePathname()
  const params = useParams()
  // Тёмные страницы (резервация + кабинет) — светлый логотип/гамбургер, без CTA-кнопки.
  const onCabinet = pathname.includes('/cabinet')
  const darkPage = pathname.includes('/book') || onCabinet
  const { menu, setMenu } = useAppContext()
  const lightIcons = menu || !!params?.post || darkPage

  useEffect(() => {
    setMenu(false)
  }, [pathname])

  useEffect(() => {
    const root = document.getElementsByTagName('html')[0]
    if (menu) {
      document.body.classList.add('overflow-y-hidden')
      root.classList.add('overflow-y-hidden')
    } else {
      document.body.classList.remove('overflow-y-hidden')
      root.classList.remove('overflow-y-hidden')
    }
  }, [menu])

  return (
    <div className={'flex gap-4 lg:gap-13 items-center'}>
      {!darkPage && (
        <Button
          inverse={menu}
          className={'hidden lg:block'}
          text={'Rezervovat termín'}
          id={'book-button'}
          white={!!params?.post}
          small
          href={linkToReserve}
        />
      )}

      {/* На самой странице кабинета иконка «Můj účet» не нужна — мы уже внутри */}
      {!onCabinet && (
        <a
          href={'/cabinet'}
          aria-label={'Můj účet'}
          title={'Můj účet'}
          className={`transition-colors duration-200 hover:text-primary ${
            lightIcons ? 'text-white' : 'text-accent'
          }`}
        >
          <CabinetIcon />
        </a>
      )}

      <Hamburger
        color={lightIcons ? '#fff' : '#161615'}
        onToggle={() => setMenu(!menu)}
        toggled={menu}
        size={48}
        label={'Otevřít nebo zavřít menu'}
      />
    </div>
  )
}

export default Buttons
