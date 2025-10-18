import axios from 'axios'

export const Axios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_API || process.env.APP_API,
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

export const NoonaHQ = axios.create({
  baseURL: 'https://api.noona.is/v1/hq/companies',
})

NoonaHQ.interceptors.request.use(
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
