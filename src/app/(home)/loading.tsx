export default function Loading() {
  return (
    <main>
      <section
        className={
          'h-screen md:min-h-[800px] flex items-end relative z-10 mb-13.5 bg-gradient-to-t from-[rgba(231,30,110,1)] to-[rgba(255,0,101,0.5)]'
        }
      >
        <div className={'max-w-[1280px] mx-auto w-full px-4 md:min-h-[500px]'}>
          <div className={'pb-23 md:pb-15 max-w-[650px]'}>
            <div className={'h-[45px] lg:h-[60px] w-3/4 bg-white/20 rounded mb-4 animate-pulse'} />
            <div className={'h-[48px] w-[220px] bg-white/20 rounded animate-pulse'} />
          </div>
        </div>
      </section>
    </main>
  )
}
