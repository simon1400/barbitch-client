import axios from 'axios'

// Axios Interceptor Instance
export const Axios = axios.create({
  baseURL: process.env.APP_API,
})

// Axios.interceptors.request.use(
//   (config) => {
//     let token: any = ''
//     if (typeof window !== 'undefined') {
//       token = localStorage.getItem('token')
//     }
//     const accessToken = token ? JSON.parse(token) : ''

//     // If token is present, add it to request's Authorization Header
//     if (accessToken) {
//       if (config.headers) config.headers.token = accessToken
//     }
//     return config
//   },
//   (error) => {
//     // Handle request errors here
//     return Promise.reject(error)
//   },
// )

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
