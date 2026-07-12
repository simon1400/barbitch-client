import axios from 'axios'

const apiUrl =
  process.env.NEXT_PUBLIC_APP_API || process.env.APP_API || 'https://strapi.barbitch.cz'

export const Axios = axios.create({
  baseURL: apiUrl,
  timeout: 15000,
})

// Noona-инстансы переехали в lib/noona.ts (server-only) — NOONA_TOKEN не должен
// попадать в браузерный бандл. Ручки собственного движка (/api/engine/*) живут
// в app/book/fetch/engine.ts (отдельный axios без интерсептора ниже).

Axios.interceptors.response.use(
  (response) => response.data.data,
  (error) => {
    return Promise.reject(error)
  },
)
