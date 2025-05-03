'use client'

export const Sidebar = () => {
  return (
    <aside className={'min-w-[200px] max-w-[300px] w-full'}>
      <nav>
        <ul>
          <li>
            <a className={'py-5 px-3 bg-white block font-bold hover:bg-primary'} href={'/admin'}>
              {'Работа'}
            </a>
          </li>
          <li>
            <a
              className={'py-5 px-3 bg-white block font-bold hover:bg-primary'}
              href={'/admin/stats'}
            >
              {'Штрафы'}
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  )
}
