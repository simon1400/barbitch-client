import axios from 'axios'

// Отписка по ссылке из письма (s271). Ручки Strapi /api/unsubscribe/:token —
// публичные, защита — подписанный токен. Плоский JSON, не Strapi-обёртка {data}.

const apiUrl =
  process.env.NEXT_PUBLIC_APP_API || process.env.APP_API || 'https://strapi.barbitch.cz'

const Api = axios.create({ baseURL: apiUrl, timeout: 15000 })

export interface IUnsubscribeInfo {
  /** «ad•••@seznam.cz» — полный адрес страница не получает */
  email: string
  optedOut: boolean
}

export const UNSUBSCRIBE_REASONS: Array<{ key: string; label: string }> = [
  { key: 'too_often', label: 'Chodí mi příliš mnoho e-mailů' },
  { key: 'not_interested', label: 'Obsah e-mailů mě nezajímá' },
  { key: 'not_coming', label: 'Už k vám nechodím' },
  { key: 'other_salon', label: 'Chodím do jiného salonu' },
  { key: 'never_signed', label: 'O tyto e-maily jsem nestál(a)' },
  { key: 'other', label: 'Jiný důvod' },
]

export const COMMENT_MAX = 500

const path = (token: string) => `/api/unsubscribe/${encodeURIComponent(token)}`

export const getUnsubscribeInfo = async (token: string): Promise<IUnsubscribeInfo> =>
  (await Api.get<IUnsubscribeInfo>(path(token))).data

export const postUnsubscribe = async (
  token: string,
  action: 'unsubscribe' | 'resubscribe',
  origin: string | null,
): Promise<IUnsubscribeInfo> =>
  (
    await Api.post<IUnsubscribeInfo>(
      path(token),
      { action },
      {
        params: origin ? { z: origin } : undefined,
      },
    )
  ).data

export const postUnsubscribeReason = async (
  token: string,
  reason: string,
  comment: string,
): Promise<void> => {
  await Api.post(`${path(token)}/reason`, { reason, comment })
}
