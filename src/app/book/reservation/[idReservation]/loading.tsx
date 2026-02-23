const ReservationLoading = () => {
  return (
    <div className={'animate-pulse'}>
      {/* Info card: Datum, Trvání, Zaměstnanec, Služba, Cena */}
      <div className={'bg-[#252523] rounded-special-small px-5 pt-3.5 pb-2 mb-5'}>
        <ul>
          {[1, 2, 3].map((i) => (
            <li key={i} className={'flex justify-between py-2.5'}>
              <span className={'h-3 w-14 bg-[#3C3C3C] rounded block'} />
              <span className={'h-3 w-24 bg-[#3C3C3C] rounded block'} />
            </li>
          ))}
          {/* Služba — with borders */}
          <li
            className={
              'flex justify-between border-t-2 border-b-2 border-dotted border-[#3C3C3C] py-5 mt-2.5'
            }
          >
            <span className={'h-3 w-14 bg-[#3C3C3C] rounded block'} />
            <span className={'h-3 w-36 bg-[#3C3C3C] rounded block'} />
          </li>
          <li className={'flex justify-between py-5'}>
            <span className={'h-3 w-20 bg-[#3C3C3C] rounded block'} />
            <span className={'h-3 w-16 bg-[#3C3C3C] rounded block'} />
          </li>
          <li className={'pb-2'}>
            <span className={'h-2 w-52 bg-[#3C3C3C] rounded block'} />
          </li>
        </ul>
      </div>

      {/* Form card: Vaše informace */}
      <div className={'bg-[#252523] rounded-special-small px-5 pt-3.5 pb-5 mb-5'}>
        <div className={'flex justify-center mb-5'}>
          <span className={'h-4 w-28 bg-[#3C3C3C] rounded block'} />
        </div>
        <div className={'max-w-[270px] mx-auto'}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={'mb-4'}>
              <div className={'h-3 w-12 bg-[#3C3C3C] rounded mb-1.5'} />
              <div className={'h-10 bg-[#3C3C3C] rounded-special-small'} />
            </div>
          ))}
          {/* Toggle row */}
          <div className={'flex gap-3 items-center py-2.5'}>
            <span className={'w-9 h-5 bg-[#3C3C3C] rounded-full shrink-0 block'} />
            <span className={'h-3 w-24 bg-[#3C3C3C] rounded block'} />
          </div>
          {/* GDPR checkbox */}
          <div className={'flex gap-3 items-start py-2.5'}>
            <span className={'w-4 h-4 bg-[#3C3C3C] rounded shrink-0 block mt-0.5'} />
            <div className={'flex-1'}>
              <span className={'h-2 bg-[#3C3C3C] rounded w-full block mb-1'} />
              <span className={'h-2 bg-[#3C3C3C] rounded w-3/4 block'} />
            </div>
          </div>
        </div>
      </div>

      {/* Storno card */}
      <div className={'bg-[#252523] rounded-special-small px-5 py-3.5 mb-5'}>
        <div className={'max-w-[270px] mx-auto'}>
          <div className={'h-4 w-32 bg-[#3C3C3C] rounded mb-3.5'} />
          <div className={'h-3 bg-[#3C3C3C] rounded w-full mb-1.5'} />
          <div className={'h-3 bg-[#3C3C3C] rounded w-3/4'} />
        </div>
      </div>

      {/* Fixed bottom button */}
      <div
        className={'fixed flex items-center bottom-0 left-0 w-full h-[70px]'}
        style={{ backgroundImage: 'linear-gradient(180deg, #16161500 0%, #161615 100%)' }}
      >
        <div className={'mx-auto w-full max-w-[600px] md:px-4 px-2 text-center'}>
          <div className={'h-[44px] bg-[#3C3C3C] rounded-special-small max-w-[250px] mx-auto'} />
        </div>
      </div>
    </div>
  )
}

export default ReservationLoading
