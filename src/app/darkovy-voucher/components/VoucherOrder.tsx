'use client'
import type { VoucherItem } from 'lib/vouchers'
import type { FormEvent } from 'react'

import axios from 'axios'
import { Container } from 'components/Container'
import { ConsentCheckbox } from 'components/form/ConsentCheckbox'
import { Input } from 'components/form/Input'
import { Textarea } from 'components/form/Textarea'
import { sendGoogleAdsConversion } from 'fetch/googleAds'
import { sendCAPIEvent } from 'fetch/pixel'
import { createVoucher } from 'fetch/voucher'
import { DEDICATION_MAX, FOR_NAME_MAX, FROM_NAME_MAX, VOUCHER_VALID_MONTHS } from 'lib/vouchers'
import { useEffect, useMemo, useState } from 'react'

import { OrderSummary } from './OrderSummary'
import { VoucherCatalog } from './VoucherCatalog'

const FORM_ID = 'voucher-form'
const EMAIL_RE = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/

interface FormState {
  forName: string
  fromName: string
  dedication: string
  email: string
  phone: string
}

type ErrorKey = 'forName' | 'fromName' | 'email' | 'consent'

const EMPTY_FORM: FormState = { forName: '', fromName: '', dedication: '', email: '', phone: '' }

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
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const selected = useMemo(
    () => items.find((i) => i.id === selectedId) ?? items[0],
    [items, selectedId],
  )

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get('voucher')
    if (fromUrl && items.some((i) => i.id === fromUrl)) setSelectedId(fromUrl)
  }, [items])

  const select = (id: string) => {
    setSelectedId(id)
    if (status !== 'idle') setStatus('idle')
    const url = new URL(window.location.href)
    url.searchParams.set('voucher', id)
    window.history.replaceState(null, '', url)
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
    setStatus('idle')

    const email = form.email.trim()
    const phone = form.phone.trim()
    const dedication = form.dedication.trim()
    // eslint-disable-next-line sonarjs/pseudo-random
    const idVoucher = `${Math.floor(10000000 + Math.random() * 90000000)}`

    try {
      await createVoucher({
        name: form.fromName.trim(),
        for: form.forName.trim(),
        sum: selected.price,
        dateOrder: new Date(),
        email,
        phone,
        serviceName: selected.kind === 'sluzba' ? selected.name : null,
        dedication: dedication || null,
        deliveryMethod: 'email',
        idVoucher,
        publishedAt: null,
      })

      const conversion = { currency: 'CZK', value: selected.price }
      sendCAPIEvent('Purchase', { email, phone }, conversion)
      sendGoogleAdsConversion('Purchase', { email, phone }, conversion)

      // Comgate (další fáze): místo e-mailu s platebními údaji založit platbu
      // a přesměrovat na bránu; voucher (PDF) poslat až po potvrzení platby.
      await axios.post('/api/send-mail-voucher', {
        voucherId: selected.id,
        idVoucher,
        forName: form.forName.trim(),
        fromName: form.fromName.trim(),
        dedication,
        email,
        paymentStatus: 'pending',
      })
      setStatus('success')
    } catch {
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  if (!selected) return null

  const step = form.forName.trim() && form.fromName.trim() ? 3 : 2

  return (
    <>
      <VoucherCatalog items={items} selectedId={selected.id} onSelect={select} />

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
                  <Textarea
                    variant={'soft'}
                    className={'sm:col-span-2'}
                    name={'dedication'}
                    label={'Věnování na voucher'}
                    placeholder={'Krátký vzkaz, který vytiskneme na voucher (nepovinné)'}
                    value={form.dedication}
                    handleChange={handleChange}
                    maxLength={DEDICATION_MAX}
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
              status={status}
            />
          </div>
        </Container>
      </section>
    </>
  )
}
