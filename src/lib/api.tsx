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
    const token = '927ae84e9d3cef2c1c8757e665559fe07e2783718a1c4456f33d6ba431a9f367'
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
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
