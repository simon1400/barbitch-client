import axios from 'axios'

// Data-слой booking-флоу поверх собственного движка (Strapi custom api booking-engine,
// /api/engine/*). К Noona отсюда обращений НЕТ — каталог/мастера/слоты/холды/брони
// живут в нашей БД. Junior −20% и балансировка «Kdokoliv» считаются на сервере.

const apiUrl =
  process.env.NEXT_PUBLIC_APP_API || process.env.APP_API || 'https://strapi.barbitch.cz'

// Отдельный axios-инстанс: движок отдаёт плоский body (не Strapi-обёртку {data}),
// глобальный Axios из lib/api с интерсептором response.data.data сюда не подходит.
const Engine = axios.create({ baseURL: apiUrl, timeout: 15000 })

/** Код ошибки движка из axios-ошибки ('' если это не ответ движка). */
export const engineErrorCode = (err: unknown): string => {
  const anyErr = err as { response?: { data?: { error?: { code?: string } } } }
  return anyErr?.response?.data?.error?.code ?? ''
}

/** Абсолютный URL фото (Strapi локально отдаёт относительные /uploads/...). */
export const engineAssetUrl = (path: string | null | undefined): string | null => {
  if (!path) return null
  return path.startsWith('http') ? path : `${apiUrl}${path}`
}

// ── каталог ──

export interface IEngineVariant {
  label: string
  priceDiff: number
  durationDiff: number
  description?: string
}

export interface IEngineModifier {
  key: string
  label: string
  priceDiff: number
  durationDiff: number
  // Взаимоисключающая группа: из одной группы можно выбрать максимум один модификатор.
  group?: string
  description?: string
}

export interface IEngineService {
  id: string
  title: string
  category: string
  durationMin: number
  price: number
  description?: string
  /** Иконка услуги (Strapi media, относительный /uploads/... → engineAssetUrl). */
  iconUrl?: string | null
  variants: IEngineVariant[]
  modifiers: IEngineModifier[]
}

export interface IEngineServiceGroup {
  title: string
  services: IEngineService[]
}

export const getEngineCatalog = async (): Promise<IEngineServiceGroup[]> => {
  const res = await Engine.get('/api/engine/services')
  return res.data?.groups ?? []
}

export const getEngineService = async (serviceId: string): Promise<IEngineService> => {
  const res = await Engine.get(`/api/engine/services/${encodeURIComponent(serviceId)}`)
  return res.data
}

// ── мастера услуги ──

export interface IEngineEmployee {
  documentId: string
  name: string
  tier: 'senior' | 'junior'
  photoUrl: string | null
}

export const getEngineEmployees = async (serviceId: string): Promise<IEngineEmployee[]> => {
  const res = await Engine.get(`/api/engine/services/${encodeURIComponent(serviceId)}/employees`)
  return res.data?.employees ?? []
}

// ── выбор варианта/дополнений (шаг /extras → дальше через query) ──

export interface ISelection {
  variant: string | null
  modifiers: string[]
}

export const selectionToQuery = (sel: ISelection): string => {
  const qs = new URLSearchParams()
  if (sel.variant) qs.set('v', sel.variant)
  if (sel.modifiers.length) qs.set('m', sel.modifiers.join(','))
  const s = qs.toString()
  return s ? `?${s}` : ''
}

export const selectionFromSearchParams = (sp: {
  v?: string | string[]
  m?: string | string[]
}): ISelection => {
  const v = Array.isArray(sp?.v) ? sp.v[0] : sp?.v
  const m = Array.isArray(sp?.m) ? sp.m[0] : sp?.m
  return {
    variant: v || null,
    modifiers: (m || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  }
}

/** Итоговая senior-цена и длительность выбора (зеркало computePricing движка). */
export const calcSelectionPricing = (
  service: IEngineService,
  sel: ISelection,
): { seniorPrice: number; durationMin: number } => {
  const variant = sel.variant
    ? (service.variants.find((v) => v.label === sel.variant) ?? null)
    : null
  const mods = sel.modifiers
    .map((key) => service.modifiers.find((m) => m.key === key))
    .filter((m): m is IEngineModifier => Boolean(m))
  return {
    seniorPrice:
      service.price + (variant?.priceDiff ?? 0) + mods.reduce((s, m) => s + m.priceDiff, 0),
    durationMin:
      service.durationMin +
      (variant?.durationDiff ?? 0) +
      mods.reduce((s, m) => s + m.durationDiff, 0),
  }
}

// ── availability ──

export interface IEngineSlot {
  startMin: number
  time: string
  employees: string[]
}

export interface IEngineDay {
  date: string
  slots: IEngineSlot[]
}

export interface IEngineAvailability {
  durationMin: number
  days: IEngineDay[]
}

export const getEngineAvailability = async (params: {
  service: string
  selection: ISelection
  employee: string // personal documentId или 'any'
  from: string // YYYY-MM-DD
  to: string
}): Promise<IEngineAvailability> => {
  const qs = new URLSearchParams({
    service: params.service,
    employee: params.employee,
    from: params.from,
    to: params.to,
  })
  if (params.selection.variant) qs.set('variant', params.selection.variant)
  if (params.selection.modifiers.length) qs.set('modifiers', params.selection.modifiers.join(','))
  const res = await Engine.get(`/api/engine/availability?${qs.toString()}`)
  return res.data
}

// ── holds ──

export interface IEngineHoldService {
  title: string
  price: number
  durationMin: number
  seniorPrice: number
}

export interface IEngineHold {
  holdId: string
  expired?: boolean
  expiresAt: string
  date: string
  time: string | null
  startsAt: string
  endsAt: string
  durationMin: number
  price: number
  employee: { documentId: string; name: string; tier?: string }
  services: IEngineHoldService[]
}

export const createEngineHold = async (body: {
  service: string
  selection: ISelection
  employee: string
  date: string
  time: string
}): Promise<IEngineHold> => {
  const res = await Engine.post('/api/engine/holds', {
    service: body.service,
    variant: body.selection.variant || undefined,
    modifiers: body.selection.modifiers.join(','),
    employee: body.employee,
    date: body.date,
    time: body.time,
  })
  return res.data
}

export const getEngineHold = async (holdId: string): Promise<IEngineHold> => {
  const res = await Engine.get(`/api/engine/holds/${encodeURIComponent(holdId)}`)
  return res.data
}

// ── бронь ──

export interface IEngineBookingResult {
  bookingId: string
  cancelToken: string
  date: string
  time: string | null
  startsAt: string
  endsAt: string
  totalPrice: number
  employee: { documentId: string; name: string }
  services: IEngineHoldService[]
}

export const createEngineBooking = async (body: {
  holdId: string
  name: string
  phone: string
  email?: string
  customerComment?: string
}): Promise<IEngineBookingResult> => {
  const res = await Engine.post('/api/engine/bookings', body)
  return res.data
}

// ── дозапись с thank-you (аутентификация cancelToken только что созданной брони) ──

// Ключ sessionStorage, через который BookForm передаёт данные брони на /thank-you.
export const THANK_YOU_STORAGE_KEY = 'bb_thankyou'

export interface IRebookServiceOption {
  serviceDocId: string
  title: string
  bucket: 'manicure' | 'brows' | 'lashes'
  durationMin: number
  /** Цена услуги у этого мастера (у junior уже −20%) — показывается перечёркнутой. */
  price: number
  /** Итог со скидкой дозаписи −15%. */
  discountedPrice: number
  endTime: string
}

export interface IRebookOffer {
  employeeDocId: string
  employeeName: string
  tier: 'senior' | 'junior'
  photoUrl: string | null
  /** «Lash specialistka» / «Brow & Nail specialistka» — подпись на карточке. */
  specialist: string
  startMin: number
  startTime: string
  services: IRebookServiceOption[]
}

export interface IRebookOffers {
  available: boolean
  reason?: 'expired' | 'not_active' | 'no_client' | 'no_offers'
  discountPercent: number
  expiresAt: string
  anchor: { date: string; time: string | null }
  offers: IRebookOffer[]
}

export interface IRebookCreated {
  bookingId: string
  date: string
  time: string
  endTime: string
  totalPrice: number
  originalPrice: number
  employee: { documentId: string; name: string }
  serviceTitle: string
}

export const getEngineRebookOffers = async (token: string): Promise<IRebookOffers> => {
  const res = await Engine.get(`/api/engine/rebook/${encodeURIComponent(token)}/offers`)
  return res.data
}

export const postEngineRebook = async (
  token: string,
  body: { service: string; employee: string },
): Promise<IRebookCreated> => {
  const res = await Engine.post(`/api/engine/rebook/${encodeURIComponent(token)}`, body)
  return res.data
}

// ── отмена по токену (страница /rezervace/zrusit/[token]) ──

export interface IEngineCancelInfo {
  date: string
  time: string | null
  startsAt: string
  status: 'active' | 'checkedOut' | 'cancelled' | 'noshow'
  employeeName: string
  services: IEngineHoldService[]
  totalPrice: number | null
  cancellable: boolean
  cancelMinHours: number
  cancelled?: boolean
}

export const getEngineCancel = async (token: string): Promise<IEngineCancelInfo> => {
  const res = await Engine.get(`/api/engine/cancel/${encodeURIComponent(token)}`)
  return res.data
}

export const postEngineCancel = async (token: string): Promise<IEngineCancelInfo> => {
  const res = await Engine.post(`/api/engine/cancel/${encodeURIComponent(token)}`)
  return res.data
}

// ── správa rezervace по токену (страница /rezervace/[token]: перенос + отмена) ──

export interface IEngineManageInfo extends IEngineCancelInfo {
  rescheduleCount: number
  rescheduleLimit: number
  reschedulable: boolean
  rescheduled?: boolean
}

export const getEngineManage = async (token: string): Promise<IEngineManageInfo> => {
  const res = await Engine.get(`/api/engine/manage/${encodeURIComponent(token)}`)
  return res.data
}

/** Слоты для переноса: услуга/мастер берутся из самой брони, её интервал не блокирует. */
export const getEngineManageAvailability = async (
  token: string,
  from: string,
  to: string,
): Promise<IEngineAvailability> => {
  const qs = new URLSearchParams({ from, to })
  const res = await Engine.get(
    `/api/engine/manage/${encodeURIComponent(token)}/availability?${qs.toString()}`,
  )
  return res.data
}

export const postEngineReschedule = async (
  token: string,
  body: { date: string; time: string },
): Promise<IEngineManageInfo> => {
  const res = await Engine.post(`/api/engine/manage/${encodeURIComponent(token)}/reschedule`, body)
  return res.data
}
