'use client'
import type { VoucherItem, VoucherKind } from 'lib/vouchers'
import type { FormEvent } from 'react'

import { engineErrorCode, postVoucherCheckout } from 'app/book/fetch/engine'
import { Container } from 'components/Container'
import { ConsentCheckbox } from 'components/form/ConsentCheckbox'
import { Input } from 'components/form/Input'
import { rememberCheckout } from 'lib/voucherCheckout'
import { FOR_NAME_MAX, formatKc, FROM_NAME_MAX, VOUCHER_VALID_MONTHS } from 'lib/vouchers'
import { useEffect, useMemo, useState } from 'react'
import { flushSync } from 'react-dom'

import { ChangeLink, OrderSummary } from './OrderSummary'
import { VoucherCatalog } from './VoucherCatalog'

const FORM_ID = 'voucher-form'
const EMAIL_RE = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/

interface FormState {
  forName: string
  fromName: string
  email: string
  phone: string
}

type ErrorKey = 'forName' | 'fromName' | 'email' | 'consent'

const EMPTY_FORM: FormState = { forName: '', fromName: '', email: '', phone: '' }

const STEPS = ['Voucher', 'Komu', 'Platba']

const Steps = ({ current }: { current: number }) => (
  <ol className={'flex flex-wrap gap-x-5 gap-y-2 text-[12px] leading-[15px] font-bold uppercase'}>
    {STEPS.map((label, index) => (
      <li
        key={label}
        aria-current={index + 1 === current ? 'step' : undefined}
        className={`flex gap-1.5 ${index + 1 <= current ? 'text-accent' : 'text-[#767676]'}`}
      >
        <span className={'text-primary'}>{`0${index + 1}`}</span>
        {label}
      </li>
    ))}
  </ol>
)

const scrollToId = (id: string) => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document
    .getElementById(id)
    ?.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' })
}

const GroupTitle = ({ children }: { children: string }) => (
  <h3 className={'text-[23px] leading-[28px] font-bold mb-6'}>{children}</h3>
)

/**
 * Katalog voucherů + objednávka. Vybraný voucher sdílí katalog i souhrn;
 * jde nastavit i odkazem `?voucher=<id>` (reklama, banner).
 */
export const VoucherOrder = ({ items }: { items: VoucherItem[] }) => {
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? '')
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<ErrorKey, boolean>>>({})
  const [loading, setLoading] = useState(false)
  // Text chyby pod tlačítkem; null = bez chyby
  const [error, setError] = useState<string | null>(null)

  const selected = useMemo(
    () => items.find((i) => i.id === selectedId) ?? items[0],
    [items, selectedId],
  )

  // Skupina katalogu na telefonu: výchozí „na částku“ (viz KindSwitch)
  const [tab, setTab] = useState<VoucherKind>('castka')

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get('voucher')
    const item = fromUrl ? items.find((i) => i.id === fromUrl) : undefined
    if (item) {
      setSelectedId(item.id)
      setTab(item.kind)
    }
    // Odkaz přímo na skupinu (např. z textu ve Strapi) musí na telefonu ukázat ji
    else if (window.location.hash === '#voucher-na-sluzbu') {
      setTab('sluzba')
      // flushSync v efektu nejde — počkat, až se skupina vykreslí
      const timer = window.setTimeout(() => scrollToId('voucher-na-sluzbu'), 50)
      return () => window.clearTimeout(timer)
    }
  }, [items])

  const select = (id: string) => {
    setSelectedId(id)
    setError(null)
    const url = new URL(window.location.href)
    url.searchParams.set('voucher', id)
    window.history.replaceState(null, '', url)
    // Na telefonu a tabletu je objednávka daleko pod katalogem — lidé klikali na
    // voucher, „nic se nestalo“ a odcházeli. Po krátké pauze (ať je vidět
    // „Vybráno“) sjedeme rovnou k formuláři.
    if (window.matchMedia('(max-width: 1023px)').matches) {
      window.setTimeout(() => scrollToId('objednavka'), 200)
    }
  }

  /** „Změnit“ v souhrnu: zpět ke skupině vybraného voucheru. */
  const changeVoucher = () => {
    if (!selected) return
    flushSync(() => setTab(selected.kind))
    const phone = window.matchMedia('(max-width: 767px)').matches
    scrollToId(
      phone ? 'vouchery' : selected.kind === 'sluzba' ? 'voucher-na-sluzbu' : 'voucher-na-castku',
    )
  }

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: false }))
  }

  const validate = () => {
    const next: Partial<Record<ErrorKey, boolean>> = {
      forName: form.forName.trim().length < 2,
      fromName: form.fromName.trim().length < 2,
      email: !EMAIL_RE.test(form.email.trim()),
      consent: !consent,
    }
    setErrors(next)
    const firstInvalid = (Object.keys(next) as ErrorKey[]).find((key) => next[key])
    if (firstInvalid) {
      document.querySelector<HTMLInputElement>(`[name="${firstInvalid}"]`)?.focus()
    }
    return !firstInvalid
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (loading || !selected || !validate()) return

    setLoading(true)
    setError(null)

    const email = form.email.trim()
    const phone = form.phone.trim()

    try {
      // Cenu, číslo voucheru i platbu v Comgate zakládá server; sem se vrátí jen
      // adresa platební brány. PDF přijde e-mailem až po potvrzení platby.
      const { redirect, token } = await postVoucherCheckout({
        voucherId: selected.id,
        forName: form.forName.trim(),
        fromName: form.fromName.trim(),
        email,
        phone,
        consent,
      })
      // Kontakt pro událost Purchase na stránce „Děkujeme“ (v URL nikdy není).
      rememberCheckout(token, { email, phone })
      window.location.assign(redirect)
    } catch (err) {
      const code = engineErrorCode(err)
      setError(
        code === 'invalid_voucherId'
          ? 'Vybraný voucher už není v nabídce. Obnovte prosím stránku.'
          : code === 'too_many'
            ? 'Příliš mnoho objednávek za krátkou dobu. Zkuste to prosím později.'
            : 'Platební bránu se nepodařilo otevřít. Zkuste to prosím za chvíli nebo nám zavolejte.',
      )
      setLoading(false)
    }
  }

  if (!selected) return null

  const step = form.forName.trim() && form.fromName.trim() ? 3 : 2

  return (
    <>
      <VoucherCatalog
        items={items}
        selectedId={selected.id}
        onSelect={select}
        tab={tab}
        onTab={setTab}
      />

      <section
        id={'objednavka'}
        aria-labelledby={'objednavka-title'}
        className={'bg-white pt-20 pb-[90px] scroll-mt-6'}
      >
        <Container size={'xl'}>
          <div
            className={
              'flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b-[1.5px] border-[#1616154D] pb-5 mb-10'
            }
          >
            <h2
              id={'objednavka-title'}
              className={'text-[28px] leading-[32px] md:text-[34px] md:leading-[35px] font-bold'}
            >
              {'Objednávka'}
            </h2>
            <Steps current={step} />
          </div>

          {/* Do lg je souhrn až pod formulářem — nahoře krátce, co je vybráno. */}
          <div
            className={
              'lg:hidden flex items-center justify-between gap-4 bg-accent text-white p-[16px_20px] -mt-4 mb-10'
            }
          >
            <div className={'min-w-0'}>
              <p
                className={
                  'text-[12px] leading-[15px] font-bold uppercase tracking-[.06em] text-[#fe3a7c] mb-1'
                }
              >
                {'Vybraný voucher'}
              </p>
              <p className={'text-[16px] leading-[22px] font-bold'}>{selected.title}</p>
              <p className={'text-[14px] leading-[20px] font-medium opacity-70'}>
                {/* Částka je už v názvu voucheru na částku — bez dublu */}
                {selected.kind === 'sluzba'
                  ? formatKc(selected.price)
                  : 'Na libovolnou službu z ceníku'}
              </p>
            </div>
            <ChangeLink onClick={changeVoucher} />
          </div>

          <div className={'grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_460px] gap-12 lg:gap-20'}>
            <form
              id={FORM_ID}
              noValidate
              onSubmit={handleSubmit}
              className={'flex flex-col gap-11'}
            >
              <div>
                <GroupTitle>{'Komu voucher věnujete'}</GroupTitle>
                <div className={'grid grid-cols-1 sm:grid-cols-2 gap-[20px_24px]'}>
                  <Input
                    variant={'soft'}
                    name={'forName'}
                    label={'Pro koho'}
                    placeholder={'Anna'}
                    value={form.forName}
                    handleChange={handleChange}
                    maxLength={FOR_NAME_MAX}
                    required
                    error={errors.forName}
                    errorText={'Vyplňte jméno obdarované'}
                    hint={`${form.forName.length} / ${FOR_NAME_MAX} znaků — tiskne se na voucher`}
                  />
                  <Input
                    variant={'soft'}
                    name={'fromName'}
                    label={'Od koho'}
                    placeholder={'Petr'}
                    value={form.fromName}
                    handleChange={handleChange}
                    maxLength={FROM_NAME_MAX}
                    autoComplete={'given-name'}
                    required
                    error={errors.fromName}
                    errorText={'Vyplňte, od koho voucher je'}
                    hint={`${form.fromName.length} / ${FROM_NAME_MAX} znaků`}
                  />
                </div>
              </div>

              <div>
                <GroupTitle>{'Vaše údaje'}</GroupTitle>
                <div className={'grid grid-cols-1 sm:grid-cols-2 gap-[20px_24px] mb-6'}>
                  <Input
                    variant={'soft'}
                    type={'email'}
                    inputMode={'email'}
                    autoComplete={'email'}
                    name={'email'}
                    label={'E-mail'}
                    placeholder={'Na tento e-mail přijde PDF'}
                    value={form.email}
                    handleChange={handleChange}
                    required
                    error={errors.email}
                    errorText={'Zadejte platný e-mail'}
                  />
                  <Input
                    variant={'soft'}
                    type={'tel'}
                    inputMode={'tel'}
                    autoComplete={'tel'}
                    name={'phone'}
                    label={'Telefon'}
                    placeholder={'+420'}
                    value={form.phone}
                    handleChange={handleChange}
                  />
                </div>
                <ConsentCheckbox
                  variant={'soft'}
                  name={'consent'}
                  checked={consent}
                  error={errors.consent}
                  textClassName={'text-[14px] leading-[22px]'}
                  onChange={(value) => {
                    setConsent(value)
                    setErrors((prev) => ({ ...prev, consent: false }))
                  }}
                >
                  {'Souhlasím s '}
                  <a
                    href={'/obchodni-podminky'}
                    target={'_blank'}
                    className={'underline underline-offset-2 hover:text-primary'}
                  >
                    {'obchodními podmínkami'}
                  </a>
                  {`. Voucher platí ${VOUCHER_VALID_MONTHS} měsíců od zakoupení.`}
                </ConsentCheckbox>
              </div>
            </form>

            <OrderSummary
              item={selected}
              forName={form.forName}
              fromName={form.fromName}
              formId={FORM_ID}
              loading={loading}
              error={error}
              onChangeVoucher={changeVoucher}
            />
          </div>
        </Container>
      </section>
    </>
  )
}
