import axios from 'axios'

export const sendPixel = async (body: any) => {
  const response = await axios.post(
    `https://graph.facebook.com/v22.0/${process.env.PIXEL_ID}/events?access_token=${process.env.PIXEL_ACCESS_TOKEN}`,
    body,
  )
  console.log(response.data)
  return response.data
}
