'use client'

import { useAppContext } from 'context/AppContext'

export const Sidebar = () => {
  const { setSelect } = useAppContext()

  const handleClick = (e: any, name: string) => {
    e.preventDefault()
    setSelect(name)
  }

  return (
    <aside className={'min-w-[200px] max-w-[300px] w-full'}>
      <nav>
        <ul>
          <li>
            <a
              className={'py-5 px-3 bg-white block font-bold hover:bg-primary'}
              href={'/admin'}
              onClick={(e) => handleClick(e, 'works')}
            >
              {'Работа'}
            </a>
          </li>
          <li>
            <a
              className={'py-5 px-3 bg-white block font-bold hover:bg-primary'}
              href={'/admin/stats'}
              onClick={(e) => handleClick(e, 'penalties')}
            >
              {'Штрафы'}
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  )
}
