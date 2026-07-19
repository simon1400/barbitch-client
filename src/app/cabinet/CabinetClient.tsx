'use client'

import type { ICabinetBookings, ICabinetClient, ICabinetLoyalty } from './fetch/cabinetApi'

import { useCallback, useEffect, useState } from 'react'

import { AccountTiles } from './components/AccountTiles'
import { BookingsSection } from './components/BookingsSection'
import { HistoryPanel } from './components/HistoryPanel'
import { LoginForm } from './components/LoginForm'
import { LoyaltySection } from './components/LoyaltySection'
import { ProfileSection } from './components/ProfileSection'
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
// Свёрнутые под-панели дашборда (плашки Historie / Profil)
type Panel = 'history' | 'profile' | null

// Заголовок «Můj účet» для не-dashboard фаз (login/loading/…) — по центру
const SimpleHeader = () => (
  <div className={'mb-5.5 text-center'}>
    <h1 className={'text-[#FFFFFFBF] text-resLg'}>{'Můj účet'}</h1>
  </div>
)

const DisabledBox = () => (
  <>
    <SimpleHeader />
    <Box>
      <p className={'text-white text-resMd1 mb-1'}>{'Kabinet zatím není dostupný'}</p>
      <p className={'text-[#A0A0A0] text-xss'}>{'Zkuste to prosím později.'}</p>
    </Box>
  </>
)

const LoadingBox = () => (
  <>
    <SimpleHeader />
    <Box>
      <p className={'text-[#A0A0A0] text-xss animate-pulse'}>{'Načítám…'}</p>
    </Box>
  </>
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
  const [panel, setPanel] = useState<Panel>(null)

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
    setPanel(null)
    setPhase('login')
  }

  if (phase === 'loading') return <LoadingBox />
  if (phase === 'disabled') return <DisabledBox />
  if (phase === 'login') {
    return (
      <>
        <SimpleHeader />
        <LoginForm />
      </>
    )
  }
  if (phase === 'error' || !client || !bookings) {
    return (
      <>
        <SimpleHeader />
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
      </>
    )
  }

  // Свёрнутые под-панели: заменяют весь дашборд (своя шапка «‹» назад)
  if (panel === 'history') {
    return <HistoryPanel history={bookings.history} onBack={() => setPanel(null)} />
  }
  if (panel === 'profile') {
    return <ProfileSection client={client} onSaved={setClient} onBack={() => setPanel(null)} />
  }

  return (
    <>
      <header className={'flex items-start justify-between gap-4 mb-6'}>
        <div className={'min-w-0'}>
          <p className={'text-[#A0A0A0] text-xss uppercase tracking-[0.14em]'}>{'Můj účet'}</p>
          <h1 className={'text-white text-resLg leading-none mt-1.5 truncate'}>{client.name}</h1>
        </div>
        <button
          type={'button'}
          onClick={logout}
          className={
            'shrink-0 border border-[#3C3C3C] text-[#A0A0A0] text-xss rounded-special-small px-4 py-2.5 hover:text-white hover:border-[#5a5a5a] transition-colors'
          }
        >
          {'Odhlásit'}
        </button>
      </header>
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
      <AccountTiles
        bookings={bookings}
        client={client}
        onOpenHistory={() => setPanel('history')}
        onOpenProfile={() => setPanel('profile')}
      />
    </>
  )
}
