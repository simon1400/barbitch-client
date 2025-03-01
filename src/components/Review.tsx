import { StarEmpty } from 'icons/StarEmpty'
import { StarSolid } from 'icons/StarSolid'
import Image from 'next/image'

export const Stars = ({ star, align }: { star: number; align?: 'right' | 'center' }) => {
  return (
    <div
      className={`flex items-center gap-0.5 ${align === 'right' ? 'md:justify-end' : 'justify-center'}`}
    >
      <span className={'w-4'}>
        <StarSolid />
      </span>
      <span className={'w-4'}>{star >= 2 ? <StarSolid /> : <StarEmpty />}</span>
      <span className={'w-4'}>{star >= 3 ? <StarSolid /> : <StarEmpty />}</span>
      <span className={'w-4'}>{star >= 4 ? <StarSolid /> : <StarEmpty />}</span>
      <span className={'w-4'}>{star === 5 ? <StarSolid /> : <StarEmpty />}</span>
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
            />
          </div>
          <h5 className={'uppercase text-sm'}>{data.reviewer.displayName}</h5>
        </div>
        <div className={'h-4'}>
          <Stars star={data.starRating} align={'right'} />
        </div>
      </div>
      <div className={'text-baseSm'}>
        <p>{data.comment.split('(Original)')[1]}</p>
      </div>
    </div>
  )
}

export default Review
