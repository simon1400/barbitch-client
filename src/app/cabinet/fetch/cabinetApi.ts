import type { IEngineAvailability, IEngineManageInfo } from '../../book/fetch/engine'

import axios from 'axios'

// Data-слой личного кабинета клиента (/api/cabinet/* — custom api client-cabinet).
// Ручки отдают ПЛОСКИЙ body (без Strapi-обёртки {data}) → свой axios-инстанс без
// интерсептора-разворота (паттерн engine.ts s101). Авторизация — client-JWT
// (HS256, TTL 30 дн) в localStorage, Bearer-заголовок ставит request-интерсептор.

const apiUrl =
  process.env.NEXT_PUBLIC_APP_API || process.env.APP_API || 'https://strapi.barbitch.cz'

const JWT_KEY = 'bb_cabinet_jwt'

export const getCabinetJwt = (): string | null => {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(JWT_KEY)
}

export const setCabinetJwt = (jwt: string) => {
  window.localStorage.setItem(JWT_KEY, jwt)
}

export const clearCabinetJwt = () => {
  window.localStorage.removeItem(JWT_KEY)
}

const Cabinet = axios.create({ baseURL: apiUrl, timeout: 15000 })

Cabinet.interceptors.request.use((config) => {
  const jwt = getCabinetJwt()
  if (jwt) config.headers.Authorization = `Bearer ${jwt}`
  return config
})

/** Код ошибки кабинета/движка из axios-ошибки ('' если это не наш ответ). */
export const cabinetErrorCode = (err: unknown): string => {
  const anyErr = err as { response?: { data?: { error?: { code?: string } } } }
  return anyErr?.response?.data?.error?.code ?? ''
}

/** HTTP-статус ответа из axios-ошибки (0 если ответа нет). */
export const cabinetErrorStatus = (err: unknown): number => {
  const anyErr = err as { response?: { status?: number } }
  return anyErr?.response?.status ?? 0
}

// ── типы ──

export interface ICabinetClient {
  documentId: string
  name: string
  phone: string | null
  email: string | null
  birthday: string | null
  marketingConsent: boolean
  emailVerifiedAt: string | null
}

/** Снапшот услуги внутри брони (движковые несут serviceDocId/variant/modifiers). */
export interface ICabinetBookingService {
  title: string
  price?: number
  durationMin?: number
  serviceDocId?: string | null
  variant?: string | null
  modifiers?: string[]
}

export interface ICabinetBooking {
  documentId: string
  date: string | null
  time: string | null
  startsAt: string | null
  status: 'active' | 'checkedOut' | 'cancelled' | 'noshow'
  arrived: boolean
  services: ICabinetBookingService[]
  totalPrice: number | null
  // Применённая скидка bitchcard (null — скидки на брони нет)
  discount: { discountKc: number; rewardTitle: string | null; code: string | null } | null
  employeeName: string | null
  canCancel: boolean
  canReschedule: boolean
  canRebook: boolean
}

export interface ICabinetBookings {
  upcoming: ICabinetBooking[]
  history: ICabinetBooking[]
}

// ── лояльность bitchcard (К4) ──

export interface ILoyaltyRedemption {
  status: 'available' | 'used' | 'expired'
  code: string | null
  expiresAt: string | null
}

export interface ILoyaltyTrackItem {
  title: string
  thresholdKc: number
  discountType: 'percent' | 'fixed' | 'voucher'
  discountValue: number
  reached: boolean
  redemption: ILoyaltyRedemption | null
}

export interface ILoyaltyTransaction {
  delta: number
  reason: 'visit' | 'manual' | 'signup' | 'referral'
  comment: string | null
  createdAt: string
}

export interface ICabinetLoyalty {
  cardYear: number
  balanceKc: number
  stamps: number
  track: ILoyaltyTrackItem[]
  transactions: ILoyaltyTransaction[]
}

export interface IApplyRedemptionResult {
  applied: boolean
  code: string
  reward: { title: string; discountType: string; discountValue: number }
  discountKc: number
  totalPrice: number
  originalPrice: number
}

// ── auth ──

export const postCabinetLogin = async (email: string): Promise<{ ok: boolean }> => {
  const res = await Cabinet.post('/api/cabinet/login', { email })
  return res.data
}

export const getCabinetVerify = async (
  token: string,
): Promise<{ jwt: string; client: { documentId: string; name: string; email: string | null } }> => {
  const res = await Cabinet.get(`/api/cabinet/login/verify?token=${encodeURIComponent(token)}`)
  return res.data
}

// ── профиль ──

export const getCabinetMe = async (): Promise<ICabinetClient> => {
  const res = await Cabinet.get('/api/cabinet/me')
  // Скользящее продление сессии: сервер переподписывает токен старше 7 дней —
  // сохраняем свежий, срок сдвигается на 30 дней от визита.
  const { renewedJwt, ...me } = res.data as ICabinetClient & { renewedJwt?: string }
  if (renewedJwt) setCabinetJwt(renewedJwt)
  return me
}

export const patchCabinetMe = async (patch: {
  name?: string
  phone?: string
  birthday?: string | null
  marketingConsent?: boolean
}): Promise<ICabinetClient> => {
  const res = await Cabinet.patch('/api/cabinet/me', patch)
  return res.data
}

// ── брони ──

export const getCabinetBookings = async (): Promise<ICabinetBookings> => {
  const res = await Cabinet.get('/api/cabinet/bookings')
  return res.data
}

export const postCabinetCancel = async (bookingId: string): Promise<IEngineManageInfo> => {
  const res = await Cabinet.post(`/api/cabinet/bookings/${encodeURIComponent(bookingId)}/cancel`)
  return res.data
}

export const getCabinetBookingAvailability = async (
  bookingId: string,
  from: string,
  to: string,
): Promise<IEngineAvailability> => {
  const qs = new URLSearchParams({ from, to })
  const res = await Cabinet.get(
    `/api/cabinet/bookings/${encodeURIComponent(bookingId)}/availability?${qs.toString()}`,
  )
  return res.data
}

export const postCabinetReschedule = async (
  bookingId: string,
  body: { date: string; time: string },
): Promise<IEngineManageInfo> => {
  const res = await Cabinet.post(
    `/api/cabinet/bookings/${encodeURIComponent(bookingId)}/reschedule`,
    body,
  )
  return res.data
}

// ── лояльность bitchcard ──

// Цифровая карточка: баланс/наклейки/трек/транзакции. 503 loyalty_disabled →
// программа выключена (секцию в UI не показываем).
export const getCabinetLoyalty = async (): Promise<ICabinetLoyalty> => {
  const res = await Cabinet.get('/api/cabinet/loyalty')
  return res.data
}

// Уплатнить награду (код из трека) на свою предстоящую бронь — скидка на totalPrice
export const postCabinetApplyRedemption = async (
  bookingId: string,
  code: string,
): Promise<IApplyRedemptionResult> => {
  const res = await Cabinet.post(
    `/api/cabinet/bookings/${encodeURIComponent(bookingId)}/redemption`,
    { code },
  )
  return res.data
}

// Снять применённую скидку со своей активной брони — награда вернётся в трек
export const deleteCabinetRedemption = async (
  bookingId: string,
): Promise<{ released: number; code?: string; discountKc?: number }> => {
  const res = await Cabinet.delete(
    `/api/cabinet/bookings/${encodeURIComponent(bookingId)}/redemption`,
  )
  return res.data
}
