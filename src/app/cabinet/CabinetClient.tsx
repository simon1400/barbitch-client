'use client'

import type { ICabinetBookings, ICabinetClient, ICabinetLoyalty } from './fetch/cabinetApi'

import { useCallback, useEffect, useState } from 'react'

import { BookingsSection } from './components/BookingsSection'
import { LoginForm } from './components/LoginForm'
import { LoyaltySection } from './components/LoyaltySection'
import { ProfileSection } from './components/ProfileSection'
import { RebookSection } from './components/RebookSection'
import { Box } from './components/shared'
import {
  cabinetErrorStatus,
  clearCabinetJwt,
  getCabinetBookings,
  getCabinetJwt,
  getCabinetLoyalty,
  getCabinetMe,
} from './fetch/cabinetApi'

type Phase = 'loading' | 'login' | 'dashboard' | 'disabled' | 'error'

const DisabledBox = () => (
  <Box>
    <p className={'text-white text-resMd1 mb-1'}>{'Kabinet zatím není dostupný'}</p>
    <p className={'text-[#A0A0A0] text-xss'}>{'Zkuste to prosím později.'}</p>
  </Box>
)

const LoadingBox = () => (
  <Box>
    <p className={'text-[#A0A0A0] text-xss animate-pulse'}>{'Načítám…'}</p>
  </Box>
)

// Оркестратор кабинета: гейт по client-JWT из localStorage → login-форма или
// dashboard (брони + rychlá rezervace + профиль). 401 → чистка JWT → login;
// 503 (нет CLIENT_JWT_SECRET на сервере) → «kabinet není dostupný».
export const CabinetClient = ({ salonPhone }: { salonPhone: string }) => {
  const [phase, setPhase] = useState<Phase>('loading')
  const [client, setClient] = useState<ICabinetClient | null>(null)
  const [bookings, setBookings] = useState<ICabinetBookings | null>(null)
  // null = программа лояльности выключена (503 loyalty_disabled) / не загрузилась —
  // секция «Věrnostní program» просто не показывается, кабинет живёт без неё
  const [loyalty, setLoyalty] = useState<ICabinetLoyalty | null>(null)

  const load = useCallback(async () => {
    if (!getCabinetJwt()) {
      setPhase('login')
      return
    }
    setPhase('loading')
    try {
      const [me, list, loyaltyData] = await Promise.all([
        getCabinetMe(),
        getCabinetBookings(),
        getCabinetLoyalty().catch(() => null),
      ])
      setClient(me)
      setBookings(list)
      setLoyalty(loyaltyData)
      setPhase('dashboard')
    } catch (err) {
      const status = cabinetErrorStatus(err)
      if (status === 401) {
        clearCabinetJwt()
        setPhase('login')
      } else if (status === 503) {
        setPhase('disabled')
      } else {
        setPhase('error')
      }
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const reloadBookings = useCallback(async () => {
    try {
      setBookings(await getCabinetBookings())
    } catch {
      // тихо: список обновится при следующей загрузке
    }
  }, [])

  // после уплатнения скидки обновляются и брони (новая цена), и карточка (used)
  const reloadBookingsAndLoyalty = useCallback(async () => {
    await reloadBookings()
    try {
      setLoyalty(await getCabinetLoyalty())
    } catch {
      // тихо: карточка обновится при следующей загрузке
    }
  }, [reloadBookings])

  const logout = () => {
    clearCabinetJwt()
    setClient(null)
    setBookings(null)
    setLoyalty(null)
    setPhase('login')
  }

  if (phase === 'loading') return <LoadingBox />
  if (phase === 'disabled') return <DisabledBox />
  if (phase === 'login') return <LoginForm />
  if (phase === 'error' || !client || !bookings) {
    return (
      <Box>
        <p className={'text-[#A0A0A0] text-xss mb-4'}>
          {'Data se nepodařilo načíst. Zkuste to prosím znovu.'}
        </p>
        <button
          type={'button'}
          onClick={load}
          className={
            'inline-block bg-primary text-white text-xs1 font-bold rounded-special-small px-6 py-3'
          }
        >
          {'Zkusit znovu'}
        </button>
      </Box>
    )
  }

  return (
    <>
      <div className={'flex items-center justify-between mb-2'}>
        <p className={'text-white text-xs1'}>
          {'Vítejte, '}
          <span className={'font-semibold'}>{client.name}</span>
        </p>
        <button
          type={'button'}
          onClick={logout}
          className={'text-[#A0A0A0] text-xss underline hover:text-white'}
        >
          {'Odhlásit se'}
        </button>
      </div>
      <BookingsSection
        bookings={bookings}
        salonPhone={salonPhone}
        onChanged={reloadBookingsAndLoyalty}
      />
      {loyalty && (
        <LoyaltySection
          loyalty={loyalty}
          bookings={bookings}
          onChanged={reloadBookingsAndLoyalty}
        />
      )}
      <RebookSection bookings={bookings} />
      <ProfileSection client={client} onSaved={setClient} />
    </>
  )
}
