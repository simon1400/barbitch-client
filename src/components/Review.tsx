import Image from 'next/image'

const StarIcon = ({ solid }: { solid: boolean }) => (
  <span className={'w-4'} aria-hidden={'true'}>
    <Image
      src={solid ? '/assets/icons/starSolid.svg' : '/assets/icons/starEmpty.svg'}
      alt={''}
      width={16}
      height={14}
      className={'w-full h-auto'}
    />
  </span>
)

export const Stars = ({ star, align }: { star: number; align?: 'right' | 'center' }) => {
  return (
    <div
      className={`flex items-center gap-0.5 ${align === 'right' ? 'md:justify-end' : 'justify-center'}`}
      role={'img'}
      aria-label={`Hodnocení ${star} z 5`}
    >
      <StarIcon solid />
      <StarIcon solid={star >= 2} />
      <StarIcon solid={star >= 3} />
      <StarIcon solid={star >= 4} />
      <StarIcon solid={star === 5} />
    </div>
  )
}

const Review = ({
  data,
}: {
  data: {
    comment: string
    reviewer: {
      displayName: string
      profilePhotoUrl: string
    }
    starRating: number
  }
}) => {
  return (
    <div className={'rounded-[8px] border border-[#DDDDDD] py-10 px-5 md:px-9 bg-white'}>
      <div className={'md:flex md:justify-between items-center mb-7 gap-2'}>
        <div className={'flex items-center gap-2.5 mb-5 md:mb-0'}>
          <div className={'rounded-full min-w-[52px] w-[52px] h-[52px] overflow-hidden relative'}>
            <Image
              className={'object-cover w-full h-full'}
              src={data.reviewer.profilePhotoUrl}
              fill
              alt={data.reviewer.displayName}
              loading={'lazy'}
              quality={70}
              sizes={'52px'}
            />
          </div>
          <p className={'uppercase text-sm font-bold'}>{data.reviewer.displayName}</p>
        </div>
        <div className={'h-4'}>
          <Stars star={data.starRating} align={'right'} />
        </div>
      </div>
      <div className={'text-baseSm'}>
        <p>
          {data.comment.split('(Original)')[1]?.length > 200
            ? `${data.comment.split('(Original)')[1].slice(0, 200)}…`
            : data.comment.split('(Original)')[1]}
        </p>
      </div>
    </div>
  )
}

export default Review
