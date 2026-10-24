// Kontakt kupující mezi objednávkou a stránkou „Děkujeme“ (s275): pro událost Purchase
// ve FB CAPI / Google Ads po skutečném zaplacení. Jen v sessionStorage tohoto okna —
// do URL (a tím do analytiky) se e-mail nedostane. Úložiště může chybět (soukromé okno).

const KEY = 'voucher-checkout:'

export interface CheckoutContact {
  email: string
  phone: string
  /** Purchase už odeslán — při obnovení stránky se nepošle znovu. */
  tracked?: boolean
}

export const rememberCheckout = (token: string, contact: CheckoutContact) => {
  try {
    sessionStorage.setItem(KEY + token, JSON.stringify(contact))
  } catch {
    // bez úložiště jen nebude Purchase
  }
}

export const readCheckout = (token: string): CheckoutContact | null => {
  try {
    const raw = sessionStorage.getItem(KEY + token)
    return raw ? (JSON.parse(raw) as CheckoutContact) : null
  } catch {
    return null
  }
}
