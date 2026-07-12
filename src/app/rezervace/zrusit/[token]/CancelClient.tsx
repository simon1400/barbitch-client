'use client'

import type { IEngineCancelInfo } from '../../../book/fetch/engine'

import { formatInTimeZone } from 'date-fns-tz'
import { useState } from 'react'

import { engineErrorCode, postEngineCancel } from '../../../book/fetch/engine'

const STATUS_LABELS: Record<string, string> = {
  active: 'Aktivní',
  checkedOut: 'Proběhla',
  cancelled: 'Zrušena',
  noshow: 'Nedostavila se',
}

const Box = ({ children }: { children: React.ReactNode }) => (
  <div className={'bg-[#252523] rounded-special-small p-6 text-center'}>{children}</div>
)

const CancelledBox = () => (
  <Box>
    <p className={'text-white text-resMd1 mb-1'}>{'Rezervace byla zrušena'}</p>
    <p className={'text-[#A0A0A0] text-xss mb-5'}>
      {'Budeme se těšit příště. Nový termín si můžete rezervovat kdykoli.'}
    </p>
    <a
      className={
        'inline-block bg-primary text-white text-xs1 font-bold rounded-special-small px-6 py-3'
      }
      href={'/book'}
    >
      {'Rezervovat nový termín'}
    </a>
  </Box>
)

const TooLateBox = ({ hours, salonPhone }: { hours: number; salonPhone: string }) => (
  <Box>
    <p className={'text-white text-resMd1 mb-1'}>{'Rezervaci už nelze zrušit online'}</p>
    <p className={'text-[#A0A0A0] text-xss'}>
      {`Rezervace lze rušit nejpozději ${hours} hodiny předem. `}
      {salonPhone ? 'Zavolejte prosím do salonu: ' : 'Kontaktujte prosím salon.'}
      {salonPhone && (
        <a className={'text-primary underline'} href={`tel:${salonPhone.replaceAll(' ', '')}`}>
          {salonPhone}
        </a>
      )}
    </p>
  </Box>
)

const ConfirmBox = ({
  submitting,
  error,
  onCancel,
}: {
  submitting: boolean
  error: string
  onCancel: () => void
}) => (
  <Box>
    <p className={'text-[#A0A0A0] text-xss mb-5'}>{'Opravdu chcete tuto rezervaci zrušit?'}</p>
    {error && <p className={'text-[#E71E6E] text-xss mb-4'}>{error}</p>}
    <button
      type={'button'}
      onClick={onCancel}
      disabled={submitting}
      className={`w-full max-w-[270px] transition-colors duration-150 text-white font-semibold text-xs1 py-3.5 rounded-special-small ${
        submitting ? 'bg-[#5a5a5a] cursor-progress' : 'bg-[#E71E6E] hover:bg-[#c9195f]'
      }`}
    >
      {submitting ? 'Ruším…' : 'Zrušit rezervaci'}
    </button>
  </Box>
)

interface Props {
  token: string
  initialInfo: IEngineCancelInfo
  salonPhone: string
}

export const CancelClient = ({ token, initialInfo, salonPhone }: Props) => {
  const [info, setInfo] = useState<IEngineCancelInfo>(initialInfo)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [cancelled, setCancelled] = useState(initialInfo.status === 'cancelled')

  const serviceTitle = info.services?.[0]?.title ?? ''

  const cancelErrorMessage = (code: string): string => {
    if (code === 'too_late') {
      const phone = salonPhone ? `: ${salonPhone}` : '.'
      return `Rezervaci lze zrušit nejpozději ${info.cancelMinHours} hodiny předem. Zavolejte prosím do salonu${phone}`
    }
    if (code === 'not_active') return 'Rezervace už není aktivní.'
    return 'Zrušení se nepodařilo. Zkuste to prosím znovu.'
  }

  const handleCancel = async () => {
    if (submitting) return
    setSubmitting(true)
    setError('')
    try {
      const result = await postEngineCancel(token)
      setInfo((prev) => ({ ...prev, ...result }))
      setCancelled(true)
    } catch (err) {
      setError(cancelErrorMessage(engineErrorCode(err)))
    } finally {
      setSubmitting(false)
    }
  }

  const renderAction = () => {
    if (cancelled) return <CancelledBox />
    if (info.status !== 'active') {
      return (
        <Box>
          <p className={'text-[#A0A0A0] text-xss'}>{'Tuto rezervaci už nelze zrušit.'}</p>
        </Box>
      )
    }
    if (!info.cancellable) return <TooLateBox hours={info.cancelMinHours} salonPhone={salonPhone} />
    return <ConfirmBox submitting={submitting} error={error} onCancel={handleCancel} />
  }

  return (
    <>
      <div
        className={'bg-[#252523] rounded-special-small px-5 pt-3.5 pb-2 text-[14px]/[17px] mb-5'}
      >
        <ul>
          <li className={'flex justify-between py-2.5'}>
            <span className={'text-[#A0A0A0]'}>{'Datum'}</span>
            <span className={'text-white'}>
              {formatInTimeZone(new Date(info.startsAt), 'Europe/Prague', 'd.M.yyyy HH:mm')}
            </span>
          </li>
          <li className={'flex justify-between py-2.5'}>
            <span className={'text-[#A0A0A0]'}>{'Zaměstnanec'}</span>
            <span className={'text-white'}>{info.employeeName || '—'}</span>
          </li>
          {serviceTitle && (
            <li className={'flex justify-between py-2.5 gap-4'}>
              <span className={'text-[#A0A0A0]'}>{'Služba'}</span>
              <span className={'text-white text-right'}>{serviceTitle}</span>
            </li>
          )}
          {info.totalPrice != null && (
            <li className={'flex justify-between py-2.5'}>
              <span className={'text-[#A0A0A0]'}>{'Cena'}</span>
              <span className={'text-white'}>{`${info.totalPrice} Kč`}</span>
            </li>
          )}
          <li
            className={'flex justify-between border-t-2 border-dotted border-[#3C3C3C] py-2.5 mt-1'}
          >
            <span className={'text-[#A0A0A0]'}>{'Stav'}</span>
            <span className={cancelled ? 'text-[#E71E6E]' : 'text-white'}>
              {cancelled ? STATUS_LABELS.cancelled : (STATUS_LABELS[info.status] ?? info.status)}
            </span>
          </li>
        </ul>
      </div>

      {renderAction()}
    </>
  )
}
