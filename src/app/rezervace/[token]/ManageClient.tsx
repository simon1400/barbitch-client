'use client'

import type { IEngineManageInfo } from '../../book/fetch/engine'

import { formatInTimeZone } from 'date-fns-tz'
import { useState } from 'react'

import { engineErrorCode, postEngineCancel } from '../../book/fetch/engine'

import { RescheduleSection } from './RescheduleSection'

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
    <p className={'text-white text-resMd1 mb-1'}>{'Rezervaci už nelze upravit online'}</p>
    <p className={'text-[#A0A0A0] text-xss'}>
      {`Změny a zrušení jsou možné nejpozději ${hours} hodiny předem. `}
      {salonPhone ? 'Zavolejte prosím do salonu: ' : 'Kontaktujte prosím salon.'}
      {salonPhone && (
        <a className={'text-primary underline'} href={`tel:${salonPhone.replaceAll(' ', '')}`}>
          {salonPhone}
        </a>
      )}
    </p>
  </Box>
)

const CancelConfirmBox = ({
  submitting,
  error,
  onCancel,
  onBack,
}: {
  submitting: boolean
  error: string
  onCancel: () => void
  onBack: () => void
}) => (
  <Box>
    <p className={'text-[#A0A0A0] text-xss mb-5'}>{'Opravdu chcete tuto rezervaci zrušit?'}</p>
    {error && <p className={'text-[#E71E6E] text-xss mb-4'}>{error}</p>}
    <div className={'flex flex-col items-center gap-3'}>
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
      <button
        type={'button'}
        onClick={onBack}
        disabled={submitting}
        className={
          'w-full max-w-[270px] border border-[#3C3C3C] text-[#A0A0A0] text-xs1 py-3 rounded-special-small hover:text-white'
        }
      >
        {'Zpět'}
      </button>
    </div>
  </Box>
)

const ActionsBox = ({
  info,
  onReschedule,
  onCancelClick,
}: {
  info: IEngineManageInfo
  onReschedule: () => void
  onCancelClick: () => void
}) => (
  <Box>
    <div className={'flex flex-col items-center gap-3'}>
      {info.reschedulable && (
        <button
          type={'button'}
          onClick={onReschedule}
          className={
            'w-full max-w-[270px] bg-primary hover:bg-[#c9195f] transition-colors duration-150 text-white font-semibold text-xs1 py-3.5 rounded-special-small'
          }
        >
          {'Změnit termín'}
        </button>
      )}
      <button
        type={'button'}
        onClick={onCancelClick}
        className={
          'w-full max-w-[270px] border border-[#E71E6E] text-[#E71E6E] font-semibold text-xs1 py-3 rounded-special-small hover:bg-[#E71E6E14]'
        }
      >
        {'Zrušit rezervaci'}
      </button>
    </div>
    {!info.reschedulable && (
      <p className={'text-[#A0A0A0] text-xss mt-4'}>
        {'Online přesun termínu už není pro tuto rezervaci dostupný — zavolejte prosím do salonu.'}
      </p>
    )}
    <p className={'text-[#6f6f6f] text-xss mt-4'}>
      {'Chcete jinou službu? Zrušte tuto rezervaci a vytvořte novou.'}
    </p>
  </Box>
)

interface Props {
  token: string
  initialInfo: IEngineManageInfo
  salonPhone: string
}

export const ManageClient = ({ token, initialInfo, salonPhone }: Props) => {
  const [info, setInfo] = useState<IEngineManageInfo>(initialInfo)
  const [mode, setMode] = useState<'view' | 'reschedule'>('view')
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [rescheduled, setRescheduled] = useState(false)
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

  const handleRescheduled = (next: IEngineManageInfo) => {
    setInfo((prev) => ({ ...prev, ...next }))
    setRescheduled(true)
    setMode('view')
  }

  const renderAction = () => {
    if (cancelled) return <CancelledBox />
    if (info.status !== 'active') {
      return (
        <Box>
          <p className={'text-[#A0A0A0] text-xss'}>{'Tuto rezervaci už nelze upravit.'}</p>
        </Box>
      )
    }
    if (!info.cancellable) {
      return <TooLateBox hours={info.cancelMinHours} salonPhone={salonPhone} />
    }
    if (mode === 'reschedule') {
      return (
        <RescheduleSection
          token={token}
          onBack={() => setMode('view')}
          onDone={handleRescheduled}
        />
      )
    }
    if (confirmCancel) {
      return (
        <CancelConfirmBox
          submitting={submitting}
          error={error}
          onCancel={handleCancel}
          onBack={() => setConfirmCancel(false)}
        />
      )
    }
    return (
      <ActionsBox
        info={info}
        onReschedule={() => setMode('reschedule')}
        onCancelClick={() => setConfirmCancel(true)}
      />
    )
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

      {rescheduled && !cancelled && (
        <div
          className={
            'bg-[#1f3527] border border-[#2f6b3f] rounded-special-small px-5 py-3.5 text-center mb-5'
          }
        >
          <p className={'text-[#4ade80] text-xss'}>
            {'✓ Termín byl změněn. Potvrzení s novou pozvánkou jsme poslali e-mailem.'}
          </p>
        </div>
      )}

      {renderAction()}
    </>
  )
}
