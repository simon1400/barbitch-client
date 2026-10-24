'use client'
import type { FormEvent } from 'react'

import axios from 'axios'
import Alert from 'components/Alert'
import { ConsentCheckbox } from 'components/form/ConsentCheckbox'
import { BOOKING_CARD } from 'components/form/fieldStyles'
import { FileField } from 'components/form/FileField'
import { Input } from 'components/form/Input'
import { Textarea } from 'components/form/Textarea'
import { FIRM_LOGO_ACCEPT, FIRM_LOGO_MAX_BYTES, FIRM_MIN_COUNT } from 'lib/vouchers'
import { LoaderCircle } from 'lucide-react'
import { useState } from 'react'

const EMAIL_RE = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/

const EMPTY = {
  company: '',
  ico: '',
  count: '',
  value: '',
  person: '',
  phone: '',
  email: '',
  note: '',
}

type Field = keyof typeof EMPTY
type ErrorKey = 'company' | 'count' | 'person' | 'email' | 'consent'

/** Poptávkový formulář vpravo na /firemni-vouchery — karta a pole ve stylu rezervace. */
export const FirmInquiryForm = ({ email, phone }: { email: string; phone: string }) => {
  const [form, setForm] = useState(EMPTY)
  const [consent, setConsent] = useState(false)
  const [logo, setLogo] = useState<File | null>(null)
  const [errors, setErrors] = useState<Partial<Record<ErrorKey, boolean>>>({})
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name as Field]: value }))
    setErrors((prev) => ({ ...prev, [name]: false }))
  }

  const validate = () => {
    const count = Number(form.count)
    const next: Partial<Record<ErrorKey, boolean>> = {
      company: form.company.trim().length < 2,
      count: !Number.isInteger(count) || count < FIRM_MIN_COUNT,
      person: form.person.trim().length < 2,
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
    if (loading || !validate()) return
    setLoading(true)
    setStatus('idle')
    try {
      const body = new FormData()
      for (const [key, value] of Object.entries(form)) body.append(key, value)
      body.append('consent', String(consent))
      if (logo) body.append('logo', logo)
      await axios.post('/api/send-mail-firm-voucher', body)
      setStatus('success')
    } catch {
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  const field = (name: Field) => ({
    variant: 'booking' as const,
    name,
    value: form[name],
    handleChange,
  })

  return (
    <aside
      id={'poptavka'}
      aria-labelledby={'poptavka-title'}
      className={`lg:sticky lg:top-6 self-start scroll-mt-6 ${BOOKING_CARD} text-white p-6 md:p-8`}
    >
      <form noValidate onSubmit={handleSubmit} className={'flex flex-col gap-[18px]'}>
        <div className={'flex flex-col gap-2'}>
          <p
            className={
              'text-[12px] leading-[15px] font-bold uppercase tracking-[.06em] text-[#fe3a7c]'
            }
          >
            {'Pro firmy'}
          </p>
          <h2 id={'poptavka-title'} className={'text-[25px] leading-[30px] font-bold'}>
            {'Nezávazná poptávka'}
          </h2>
          <p className={'text-[14px] leading-[22px] font-medium text-white/70'}>
            {'Ozveme se do jednoho pracovního dne s cenou a návrhem voucheru.'}
          </p>
        </div>

        <div className={'grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3'}>
          <Input
            {...field('company')}
            label={'Firma'}
            autoComplete={'organization'}
            required
            error={errors.company}
            errorText={'Vyplňte název firmy'}
          />
          <Input {...field('ico')} label={'IČO'} inputMode={'numeric'} maxLength={10} />
          <Input
            {...field('count')}
            label={'Počet voucherů'}
            type={'number'}
            min={FIRM_MIN_COUNT}
            inputMode={'numeric'}
            placeholder={String(FIRM_MIN_COUNT)}
            required
            error={errors.count}
            errorText={`Nejméně ${FIRM_MIN_COUNT} kusů`}
          />
          <Input {...field('value')} label={'Hodnota / služba'} placeholder={'např. 1 000 Kč'} />
          <Input
            {...field('person')}
            label={'Kontaktní osoba'}
            autoComplete={'name'}
            required
            error={errors.person}
            errorText={'Vyplňte jméno'}
          />
          <Input
            {...field('phone')}
            label={'Telefon'}
            type={'tel'}
            inputMode={'tel'}
            autoComplete={'tel'}
          />
          <Input
            {...field('email')}
            className={'sm:col-span-2'}
            label={'E-mail'}
            type={'email'}
            inputMode={'email'}
            autoComplete={'email'}
            required
            error={errors.email}
            errorText={'Zadejte platný e-mail'}
          />
        </div>

        <Textarea
          variant={'booking'}
          name={'note'}
          label={'Poznámka'}
          placeholder={'Věnování, termín dodání, tisk…'}
          value={form.note}
          handleChange={handleChange}
          maxLength={4000}
        />

        <FileField
          variant={'booking'}
          name={'logo'}
          label={'Logo firmy (nepovinné)'}
          emptyText={'Nahrát logo (PNG, SVG, PDF…)'}
          accept={FIRM_LOGO_ACCEPT}
          maxBytes={FIRM_LOGO_MAX_BYTES}
          file={logo}
          onChange={setLogo}
        />

        <ConsentCheckbox
          name={'consent'}
          checked={consent}
          error={errors.consent}
          textClassName={'text-book'}
          onChange={(value) => {
            setConsent(value)
            setErrors((prev) => ({ ...prev, consent: false }))
          }}
        >
          {'Souhlasím se zpracováním údajů pro účely nabídky.'}
        </ConsentCheckbox>

        {status === 'success' ? (
          <Alert
            state={'success'}
            title={'Poptávka odeslána, děkujeme!'}
            text={'Do jednoho pracovního dne se ozveme s cenou a návrhem voucheru.'}
          />
        ) : (
          <>
            {status === 'error' && (
              <Alert
                state={'error'}
                title={'Poptávku se nepodařilo odeslat.'}
                text={'Zkuste to prosím znovu nebo nám napište e-mail.'}
              />
            )}
            <button
              type={'submit'}
              disabled={loading}
              className={`h-[57px] w-full bg-[#fe3a7c] hover:bg-primary text-white text-xs uppercase duration-200 ${
                loading ? 'cursor-wait' : 'cursor-pointer'
              }`}
            >
              {loading ? (
                <LoaderCircle className={'animate-spin w-7 h-7 mx-auto'} aria-label={'Odesílám'} />
              ) : (
                'Odeslat poptávku'
              )}
            </button>
          </>
        )}

        {(!!email || !!phone) && (
          <p className={'text-[14px] leading-[22px] font-medium text-white/70 text-center'}>
            {'Raději osobně? '}
            {!!email && (
              <a href={`mailto:${email}`} className={'font-bold text-white hover:text-[#fe3a7c]'}>
                {email}
              </a>
            )}
            {!!email && !!phone && ' · '}
            {!!phone && (
              <a
                href={`tel:${phone.replaceAll(' ', '')}`}
                className={'text-white hover:text-[#fe3a7c] whitespace-nowrap'}
              >
                {phone}
              </a>
            )}
          </p>
        )}
      </form>
    </aside>
  )
}
