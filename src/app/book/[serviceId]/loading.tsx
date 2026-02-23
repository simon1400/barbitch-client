const BookPersonalLoading = () => {
  return (
    <div className={'bg-[#252523] rounded-special-small px-3 pb-0 animate-pulse'}>
      <ul>
        {/* Kdokoliv row */}
        <li className={'flex items-center py-5 px-1 gap-4'}>
          <span className={'flex shrink-0'}>
            <span className={'min-w-5.5 w-5.5 h-5.5 rounded-full bg-[#3C3C3C] block'} />
            <span className={'min-w-5.5 w-5.5 h-5.5 rounded-full bg-[#3C3C3C] -ml-2.5 block'} />
          </span>
          <span className={'h-3 bg-[#3C3C3C] rounded w-24 flex-1 block'} />
        </li>

        {/* Personal rows */}
        {[1, 2].map((i) => (
          <li
            key={i}
            className={'border-t-2 border-[#3C3C3C] border-dotted flex items-center py-4 px-1 gap-4'}
          >
            <span className={'min-w-10 w-10 h-10 rounded-full bg-[#3C3C3C] shrink-0 block'} />
            <span className={'h-3 bg-[#3C3C3C] rounded w-28 flex-1 block'} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BookPersonalLoading
