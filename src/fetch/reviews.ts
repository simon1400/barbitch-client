import qs from 'qs'

import { Axios } from '../lib/api'

export interface IReview {
  reviewerName: string
  reviewerPhoto: string
  rating: number
  comment: string
}

export const getReviews = async (): Promise<IReview[]> => {
  try {
    const query = qs.stringify(
      {
        fields: ['reviewerName', 'reviewerPhoto', 'rating', 'comment'],
        sort: ['createdAt:desc'],
        pagination: { pageSize: 50 },
      },
      { encodeValuesOnly: true },
    )

    const data: any = await Axios.get(`/api/google-reviews?${query}`)
    return (data || []).map((item: any) => ({
      reviewerName: item.reviewerName,
      reviewerPhoto: item.reviewerPhoto,
      rating: item.rating,
      comment: item.comment,
    }))
  } catch (e) {
    console.error('Failed to fetch reviews:', e)
    return []
  }
}
