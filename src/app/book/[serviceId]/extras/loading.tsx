const ExtrasLoading = () => {
  return (
    <div className={'animate-pulse'}>
      {/* Title */}
      <div className={'flex justify-center mb-5 -mt-2'}>
        <span className={'h-3 bg-[#3C3C3C] rounded w-40 block'} />
      </div>

      {/* Radio options */}
      <div className={'bg-[#252523] rounded-special-small overflow-hidden'}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`flex items-center gap-4 px-4 py-4 ${
              i > 1 ? 'border-t-2 border-[#3C3C3C] border-dotted' : ''
            }`}
          >
            <span className={'shrink-0 w-5 h-5 rounded-full bg-[#3C3C3C] block'} />
            <span className={'flex-1 h-3 bg-[#3C3C3C] rounded block'} />
            <span className={'h-5 w-14 bg-[#3C3C3C] rounded-xl shrink-0 block'} />
          </div>
        ))}
      </div>

      {/* Fixed bottom: price + button */}
      <div
        className={'fixed bottom-0 left-0 w-full pt-3 pb-5'}
        style={{ backgroundImage: 'linear-gradient(180deg, #16161500 0%, #161615 70%)' }}
      >
        <div className={'mx-auto w-full max-w-[600px] md:px-4 px-2'}>
          <div className={'bg-[#252523] rounded-special-small px-4 py-4'}>
            <div className={'flex items-center justify-between mb-4'}>
              <span className={'h-3 w-12 bg-[#3C3C3C] rounded block'} />
              <span className={'h-5 w-20 bg-[#3C3C3C] rounded block'} />
            </div>
            <div className={'h-[50px] bg-[#3C3C3C] rounded-special-small'} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExtrasLoading
