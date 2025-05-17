'use client'
import Button from 'components/Button'
import { useAppContext } from 'context/AppContext'
import { Squash as Hamburger } from 'hamburger-react'
import { useParams, usePathname } from 'next/navigation'
import { useEffect } from 'react'

const Buttons = ({ linkToReserve }: { linkToReserve: string }) => {
  const pathname = usePathname()
  const params = useParams()
  const bookPage = pathname.includes('/book')
  const { menu, setMenu } = useAppContext()

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
    <div className={'flex gap-13 items-center'}>
      {!bookPage && (
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

      <Hamburger
        color={menu || params?.post || bookPage ? '#fff' : '#161615'}
        onToggle={() => setMenu(!menu)}
        toggled={menu}
        size={48}
        duration={0.3}
        distance={'sm'}
        aria-label={'Открыть или закрыть меню'}
        aria-expanded={menu}
        aria-controls={'main-menu'}
      />
    </div>
  )
}

export default Buttons
