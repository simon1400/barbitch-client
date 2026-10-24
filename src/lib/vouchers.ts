import type { IEngineServiceGroup } from 'app/book/fetch/engine'
import type { IServiceVoucher } from 'fetch/voucher'

// Katalog dárkových voucherů — jedno pole pro katalog na stránce, souhrn
// objednávky, JSON-LD i API route (ta podle `id` dohledá cenu a šablonu PDF,
// částce z prohlížeče nevěří).
//
// Vouchery na službu spravuje majitelka ve Strapi („Vaucher page“ → Vouchery na
// službu, ručka GET /api/vaucher-page/service-vouchers). Seznam níže v kódu je
// jen záloha pro starý server / výpadek ručky.

export type VoucherKind = 'sluzba' | 'castka'

export interface VoucherItem {
  id: string
  kind: VoucherKind
  /** Kategorie nad názvem (jen voucher na službu). */
  tag?: string
  name: string
  price: number
  /** Popis na kartě služby. */
  desc?: string
  image: string
  /** Fotka procedury (ImageKit) — náhled voucheru na službu. */
  photo?: string
  /** documentId služby v katalogu rezervací (voucher na službu). */
  serviceId?: string
  /** Nadpis v souhrnu objednávky („Voucher na gel lak manikúru“). */
  title: string
  /** Šablona PDF (public/vouchers/<amount>.pdf) — jen voucher na částku. */
  amount?: string
}

/** Platnost voucheru od objednání — tiskne se do PDF, stejně počítá i admin. */
export const VOUCHER_VALID_MONTHS = 6
export const FOR_NAME_MAX = 18
export const FROM_NAME_MAX = 24
export const DEDICATION_MAX = 90
/** Firemní vouchery — nejmenší objednávka. */
export const FIRM_MIN_COUNT = 10
/** Logo k firemní poptávce: příloha e-mailu salonu. */
export const FIRM_LOGO_MAX_BYTES = 5 * 1024 * 1024
export const FIRM_LOGO_ACCEPT_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
  'application/postscript',
  'application/illustrator',
] as const
export const FIRM_LOGO_ACCEPT = '.png,.jpg,.jpeg,.webp,.svg,.pdf,.ai,.eps'

// ZÁLOHA (server bez ručky): služba a cena se berou z katalogu rezervací
// (GET /api/engine/services, `serviceId` = documentId služby). Když služba
// z katalogu zmizí (skrytá, smazaná), karta se nezobrazí.
const FALLBACK_SERVICE_VOUCHERS: {
  id: string
  serviceId: string
  tag: string
  name: string
  /** Nadpis v souhrnu — 4. pád se z názvu spolehlivě odvodit nedá. */
  title: string
  desc: string
  /** Fotka z galerie stránky služby (Strapi → ImageKit). */
  photo: string
}[] = [
  {
    id: 'sluzba-gel-lak',
    serviceId: 'wpz9svnhaxx6m5fsyrk8lael',
    tag: 'Nehty',
    name: 'Gel lak manikúra',
    title: 'Voucher na gel lak manikúru',
    photo: 'https://ik.imagekit.io/njc0tvfgn/strapi-uplouds/IMG_5740_10b03e75a1.jpeg',
    desc: 'Hygienická manikúra a gel lak, v ceně design dvou nehtů.',
  },
  {
    id: 'sluzba-lash-lifting',
    serviceId: 'q2dh2qnf4u9jl85dec6i9ka1',
    tag: 'Řasy',
    name: 'Lash lifting',
    title: 'Voucher na lash lifting',
    photo:
      'https://ik.imagekit.io/njc0tvfgn/strapi-uploads/C6_EF_58_FD_28_A1_4_EAE_ACA_2_A5_A78_EB_5578_E_b23261c051.jpeg',
    desc: 'Přirozené zvednutí a prodloužení vlastních řas pro otevřený pohled.',
  },
  {
    id: 'sluzba-laminace',
    serviceId: 'h5dc97zjdpq8lp7tnn6os9h7',
    tag: 'Obočí',
    name: 'Laminace obočí',
    title: 'Voucher na laminaci obočí',
    photo: 'https://ik.imagekit.io/njc0tvfgn/strapi-uploads/IMG_3072_9a4636f5b9.jpeg',
    desc: 'Laminace a úprava tvaru — upravené obočí bez denního líčení.',
  },
]

// Vouchery na částku — částka je zároveň název šablony PDF.
const AMOUNT_VOUCHERS = ['500', '1000', '1500', '2000']

export const formatKc = (value: number) => `${value.toLocaleString('cs-CZ')} Kč`

const SERVICE_IMAGE = '/assets/vouchers/sluzba.png'

const fallbackServiceItems = (groups: IEngineServiceGroup[]): VoucherItem[] => {
  const services = new Map(groups.flatMap((g) => g.services ?? []).map((s) => [s.id, s]))
  return FALLBACK_SERVICE_VOUCHERS.flatMap((cfg) => {
    const service = services.get(cfg.serviceId)
    if (!service || service.price <= 0) return []
    return [
      {
        id: cfg.id,
        kind: 'sluzba' as const,
        tag: cfg.tag,
        name: cfg.name,
        title: cfg.title,
        price: service.price,
        desc: cfg.desc,
        photo: cfg.photo,
        serviceId: cfg.serviceId,
        image: SERVICE_IMAGE,
      },
    ]
  })
}

/**
 * Celý katalog voucherů: služby + částky.
 * `remote` — karty ze Strapi (už s cenou); `null` = ručka nedostupná → záloha z kódu.
 */
export const buildVoucherCatalog = (
  groups: IEngineServiceGroup[],
  remote: IServiceVoucher[] | null = null,
): VoucherItem[] => {
  const serviceItems: VoucherItem[] = remote
    ? remote.map((r) => ({
        id: r.id,
        kind: 'sluzba' as const,
        tag: r.tag,
        name: r.name,
        title: r.title,
        price: r.price,
        desc: r.desc,
        photo: r.photo ?? undefined,
        serviceId: r.serviceId,
        image: SERVICE_IMAGE,
      }))
    : fallbackServiceItems(groups)

  const amountItems: VoucherItem[] = AMOUNT_VOUCHERS.map((amount) => ({
    id: `castka-${amount}`,
    kind: 'castka',
    name: formatKc(Number(amount)),
    title: `Dárkový voucher ${formatKc(Number(amount))}`,
    price: Number(amount),
    image: `/assets/vouchers/v${amount}.png`,
    amount,
  }))

  return [...serviceItems, ...amountItems]
}
