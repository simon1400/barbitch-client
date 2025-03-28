import axios from 'axios'

// Axios Interceptor Instance
export const Axios = axios.create({
  baseURL: process.env.APP_API,
})

export const Noona = axios.create({
  baseURL: 'https://api.noona.is/v1/marketplace',
})

// Добавляем интерцептор для установки токена
Noona.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${process.env.NOONA_TOKEN}`
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Axios Interceptor: Response Method
Axios.interceptors.response.use(
  (response) => {
    // Can be modified response
    return response.data.data
  },
  (error) => {
    // Handle response errors here
    return Promise.reject(error)
  },
)
