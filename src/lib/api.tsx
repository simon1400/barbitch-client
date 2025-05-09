import axios from 'axios'

export const Axios = axios.create({
  baseURL: process.env.APP_API,
})

export const Noona = axios.create({
  baseURL: 'https://api.noona.is/v1/marketplace',
})

Noona.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${process.env.NOONA_TOKEN}`
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

Axios.interceptors.response.use(
  (response) => {
    return response.data.data
  },
  (error) => {
    return Promise.reject(error)
  },
)
