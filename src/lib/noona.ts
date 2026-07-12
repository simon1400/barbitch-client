import axios from 'axios'

// Noona-клиенты — ТОЛЬКО для серверных модулей (Server Components / route handlers).
// НЕ импортировать из 'use client'-кода: NOONA_TOKEN не должен попадать в браузерный
// бандл (CRIT C1 аудита s79). Booking-флоу уже живёт на собственном движке
// (app/book/fetch/engine.ts); здесь остаётся легаси-чтение прайса для /cenik и
// /service/* до полного cutover от Noona.

export const Noona = axios.create({
  baseURL: 'https://api.noona.is/v1/marketplace',
  timeout: 15000,
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
  timeout: 15000,
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
