import axios from 'axios'

// Axios Interceptor Instance
export const Axios = axios.create({
  baseURL: process.env.APP_API,
})

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
