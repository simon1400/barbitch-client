'use client'

import type { ChatContact, ChatStatus } from './ChatNotices'

import { X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { ContactCard, ContactSaved, OfflineNotice } from './ChatNotices'

const API = process.env.NEXT_PUBLIC_APP_API || 'https://strapi.barbitch.cz'
const STORE_KEY = 'barbitch_chat'
/** s272: в часы салона поле контакта — если вопрос ждёт ответа столько секунд. */
const CONTACT_PROMPT_AFTER_SEC = 120
/** sessionId из ссылки письма «Máte odpověď v chatu» (`/?chat=<sessionId>`). */
const SESSION_ID_RE = /^chat_\d+_[0-9a-f]{8}$/

const TEASER_MESSAGE: ChatMessage = {
  id: -1,
  text: 'Ahoj! Máte dotaz ohledně našich služeb? Napište nám, rádi poradíme 💅',
  sender: 'admin',
  createdAt: new Date().toISOString(),
}

interface ChatMessage {
  id: number
  text: string
  sender: 'visitor' | 'admin'
  telegramFileId?: string
  createdAt: string
}

/* ─── Inline SVG Icons ─── */

function ChatIcon() {
  return (
    <svg
      width={'28'}
      height={'28'}
      viewBox={'0 0 24 24'}
      fill={'none'}
      stroke={'currentColor'}
      strokeWidth={'2'}
      strokeLinecap={'round'}
      strokeLinejoin={'round'}
    >
      <path d={'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'} />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg
      width={'20'}
      height={'20'}
      viewBox={'0 0 24 24'}
      fill={'none'}
      stroke={'currentColor'}
      strokeWidth={'2'}
      strokeLinecap={'round'}
      strokeLinejoin={'round'}
    >
      <line x1={'18'} y1={'6'} x2={'6'} y2={'18'} />
      <line x1={'6'} y1={'6'} x2={'18'} y2={'18'} />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg
      width={'20'}
      height={'20'}
      viewBox={'0 0 24 24'}
      fill={'none'}
      stroke={'currentColor'}
      strokeWidth={'2'}
      strokeLinecap={'round'}
      strokeLinejoin={'round'}
    >
      <line x1={'22'} y1={'2'} x2={'11'} y2={'13'} />
      <polygon points={'22 2 15 22 11 13 2 9 22 2'} />
    </svg>
  )
}

function ImageIcon() {
  return (
    <svg
      width={'20'}
      height={'20'}
      viewBox={'0 0 24 24'}
      fill={'none'}
      stroke={'currentColor'}
      strokeWidth={'2'}
      strokeLinecap={'round'}
      strokeLinejoin={'round'}
    >
      <rect x={'3'} y={'3'} width={'18'} height={'18'} rx={'2'} ry={'2'} />
      <circle cx={'8.5'} cy={'8.5'} r={'1.5'} />
      <polyline points={'21 15 16 10 5 21'} />
    </svg>
  )
}

/* ─── Hide scrollbars ─── */
const hideScrollbar =
  '[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'

/* ─── Component ─── */

export default function ChatWidget() {
  const [consented, setConsented] = useState(false)
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [name, setName] = useState('')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [hasSession, setHasSession] = useState(false)
  const [sending, setSending] = useState(false)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [hasUnread, setHasUnread] = useState(false)
  const [showTeaser, setShowTeaser] = useState(false)
  /* s272: часы салона (null — ещё не знаем → как онлайн), оставленный контакт */
  const [status, setStatus] = useState<ChatStatus | null>(null)
  const [contact, setContact] = useState<ChatContact | null>(null)
  const [editingContact, setEditingContact] = useState(false)
  const [now, setNow] = useState(() => Date.now())
  const openFromLink = useRef(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const lastIdRef = useRef(0)

  /* Тизер не должен всплывать на страницах бронирования — мешает контенту */
  const pathname = usePathname()
  const isBookingPage = pathname?.startsWith('/book') ?? false

  /* ─── Check cookie consent (event-driven, no polling) ─── */
  useEffect(() => {
    const check = () => {
      const match = document.cookie.match(/(?:^|; )cookie_consent=([^;]*)/)
      setConsented(match?.[1] === 'accepted')
    }
    check()
    // Listen for consent change instead of polling every 2s
    const handler = () => check()
    window.addEventListener('cookie-consent-changed', handler)
    return () => window.removeEventListener('cookie-consent-changed', handler)
  }, [])

  /* ─── Init: load session from localStorage (s272: или из ссылки письма ?chat=) ─── */
  useEffect(() => {
    let data: { sessionId?: string; name?: string; contact?: ChatContact } | null = null
    try {
      const stored = localStorage.getItem(STORE_KEY)
      if (stored) data = JSON.parse(stored)
    } catch {
      /* empty */
    }
    const url = new URL(window.location.href)
    const fromLink = url.searchParams.get('chat')
    if (fromLink) {
      url.searchParams.delete('chat')
      window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash)
      if (SESSION_ID_RE.test(fromLink)) {
        if (data?.sessionId !== fromLink) data = { sessionId: fromLink }
        openFromLink.current = true
      }
    }
    if (!data?.sessionId) return
    const sid = data.sessionId
    setSessionId(sid)
    setName(data.name || '')
    setContact(data.contact || null)
    setHasSession(true)
    // имя и контакт с сервера: ссылка на другом устройстве / контакт оставлен с другого
    if (!data.name || !data.contact) {
      fetch(`${API}/api/chat/session?sessionId=${sid}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((info) => {
          if (!info) return
          const c: ChatContact | null = info.email
            ? { type: 'email', value: info.email }
            : info.phone
              ? { type: 'phone', value: info.phone }
              : null
          const nm = data?.name || info.visitorName || ''
          setName(nm)
          setContact(c)
          try {
            localStorage.setItem(
              STORE_KEY,
              JSON.stringify({ sessionId: sid, name: nm, contact: c }),
            )
          } catch {
            /* empty */
          }
        })
        .catch(() => {})
    }
  }, [])

  /* ─── s272: ссылка из письма — открыть чат (после согласия с cookies) ─── */
  useEffect(() => {
    if (consented && openFromLink.current) {
      openFromLink.current = false
      setOpen(true)
    }
  }, [consented])

  /* ─── s272: часы салона — при открытии и раз в минуту, пока открыт ─── */
  useEffect(() => {
    if (!open) return
    const load = () =>
      fetch(`${API}/api/chat/status`)
        .then((r) => (r.ok ? r.json() : null))
        .then((s) => s && setStatus(s))
        .catch(() => {})
    load()
    const interval = setInterval(() => {
      load()
      setNow(Date.now())
    }, 60000)
    const clock = setInterval(() => setNow(Date.now()), 15000)
    return () => {
      clearInterval(interval)
      clearInterval(clock)
    }
  }, [open])

  /* ─── Teaser: show after 60s if no session and not dismissed ─── */
  useEffect(() => {
    if (hasSession || isBookingPage) {
      setShowTeaser(false)
      return
    }
    const dismissed = sessionStorage.getItem('barbitch_chat_teaser_dismissed')
    if (dismissed) return

    const timer = setTimeout(() => setShowTeaser(true), 60000)
    return () => clearTimeout(timer)
  }, [hasSession, isBookingPage])

  /* ─── Poll messages when chat is open ─── */
  useEffect(() => {
    if (!open || !sessionId) return

    const fetchMessages = async () => {
      try {
        const afterParam = lastIdRef.current ? `&after=${lastIdRef.current}` : ''
        const res = await fetch(
          `${API}/api/chat/messages?sessionId=${sessionId}${afterParam}&open=1`,
        )
        if (!res.ok) return
        const data = await res.json()
        if (!Array.isArray(data) || data.length === 0) return

        if (lastIdRef.current === 0) {
          setMessages(data)
        } else {
          setMessages((prev) => [...prev, ...data])
        }
        lastIdRef.current = data[data.length - 1].id
      } catch {
        /* silent */
      }
    }

    fetchMessages()
    const interval = setInterval(fetchMessages, 3000)
    return () => clearInterval(interval)
  }, [open, sessionId])

  /* ─── Background unread check (only if session exists, every 60s when closed) ─── */
  useEffect(() => {
    if (open || !sessionId) return

    const checkUnread = async () => {
      try {
        const afterParam = lastIdRef.current ? `&after=${lastIdRef.current}` : ''
        const res = await fetch(`${API}/api/chat/messages?sessionId=${sessionId}${afterParam}`)
        if (!res.ok) return
        const data = await res.json()
        if (Array.isArray(data) && data.some((m: ChatMessage) => m.sender === 'admin')) {
          setHasUnread(true)
        }
      } catch {
        /* silent */
      }
    }

    const interval = setInterval(checkUnread, 30000)
    return () => clearInterval(interval)
  }, [open, sessionId])

  /* ─── Lock body scroll when chat is open on mobile only ─── */
  useEffect(() => {
    const isMobile = window.innerWidth < 768
    if (!isMobile) return

    if (open) {
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.left = '0'
      document.body.style.right = '0'
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    } else {
      const top = document.body.style.top
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      if (top) window.scrollTo(0, Number.parseInt(top, 10) * -1)
    }
    return () => {
      const top = document.body.style.top
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      if (top) window.scrollTo(0, Number.parseInt(top, 10) * -1)
    }
  }, [open])

  /* ─── Auto-scroll on new messages ─── */
  const isFirstLoad = useRef(true)
  useEffect(() => {
    if (messages.length === 0) return
    // Instant scroll on first load, smooth on new messages
    messagesEndRef.current?.scrollIntoView({ behavior: isFirstLoad.current ? 'instant' : 'smooth' })
    isFirstLoad.current = false
  }, [messages])

  /* ─── Actions ─── */

  const startSession = () => {
    if (!name.trim()) return
    const id = `chat_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`
    setSessionId(id)
    setHasSession(true)
    localStorage.setItem(STORE_KEY, JSON.stringify({ sessionId: id, name: name.trim() }))
  }

  const saveContact = (c: ChatContact) => {
    setContact(c)
    setEditingContact(false)
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ sessionId, name, contact: c }))
    } catch {
      /* empty */
    }
  }

  const handleOpen = () => {
    setOpen(true)
    setHasUnread(false)
    setShowTeaser(false)
    // Show teaser as first message if no real messages yet
    if (!hasSession && messages.length === 0) {
      setMessages([TEASER_MESSAGE])
    }
  }

  const dismissTeaser = () => {
    setShowTeaser(false)
    sessionStorage.setItem('barbitch_chat_teaser_dismissed', '1')
  }

  const fetchNewMessages = async (sid: string) => {
    const afterParam = lastIdRef.current ? `&after=${lastIdRef.current}` : ''
    const res = await fetch(`${API}/api/chat/messages?sessionId=${sid}${afterParam}&open=1`)
    if (!res.ok) return
    const data = await res.json()
    if (!Array.isArray(data) || data.length === 0) return
    setMessages(lastIdRef.current === 0 ? data : (prev) => [...prev, ...data])
    lastIdRef.current = data[data.length - 1].id
  }

  const sendMessage = async () => {
    if ((!input.trim() && imageFiles.length === 0) || !sessionId || sending) return
    setSending(true)

    const text = input.trim()
    const filesToSend = [...imageFiles]
    setInput('')
    setImageFiles([])
    setImagePreviews([])
    if (fileInputRef.current) fileInputRef.current.value = ''

    try {
      if (filesToSend.length > 0) {
        for (const [i, file] of filesToSend.entries()) {
          const formData = new FormData()
          formData.append('sessionId', sessionId)
          formData.append('text', i === 0 ? text : '')
          formData.append('visitorName', name)
          formData.append('image', file)
          await fetch(`${API}/api/chat/send`, { method: 'POST', body: formData })
        }
      } else {
        await fetch(`${API}/api/chat/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, text, visitorName: name }),
        })
      }
      await fetchNewMessages(sessionId)
    } catch {
      /* silent */
    }

    setSending(false)
  }

  const readFileAsDataUrl = (file: File): Promise<string> =>
    new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.readAsDataURL(file)
    })

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const validFiles = Array.from(files).filter((f) => f.size <= 10 * 1024 * 1024)
    if (validFiles.length === 0) return
    const previews = await Promise.all(validFiles.map(readFileAsDataUrl))
    setImageFiles((prev) => [...prev, ...validFiles])
    setImagePreviews((prev) => [...prev, ...previews])
  }

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  /* s272: поле контакта — вне часов салона сразу, в часы — если вопрос ждёт ответа ≥ 2 мин */
  const offline = status ? !status.online : false
  const waitingSince = (() => {
    let since: number | null = null
    for (const m of messages) {
      if (m.id < 0) continue
      if (m.sender === 'admin') since = null
      else if (since === null) since = new Date(m.createdAt).getTime()
    }
    return since
  })()
  const askContact =
    hasSession &&
    !!sessionId &&
    (!contact || editingContact) &&
    (offline || (waitingSince !== null && now - waitingSince >= CONTACT_PROMPT_AFTER_SEC * 1000))

  /* поле контакта появилось — показать его */
  useEffect(() => {
    if (askContact) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [askContact])

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr)
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
  }

  /* ─── Render ─── */

  if (!consented) return null

  return (
    <>
      {/* ─── Chat Window ─── */}
      {open && (
        <div
          className={
            'fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 z-[9998] sm:w-[380px] sm:h-[500px] bg-accent border border-white/10 shadow-2xl flex flex-col'
          }
        >
          {/* Header */}
          <div className={'flex items-center justify-between px-4 py-3 border-b border-white/10'}>
            <div className={'flex items-center gap-2'}>
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 ${offline ? 'bg-white/30' : 'bg-green-400'}`}
              />
              <span className={'text-white font-bold text-sm'}>{'Bar.bitch Chat'}</span>
              {status && (
                <span className={'text-white/40 text-[12px]'}>
                  {status.online ? 'online' : 'offline'}
                </span>
              )}
            </div>
            <button
              type={'button'}
              onClick={() => setOpen(false)}
              className={'text-white/50 hover:text-white transition-colors'}
              aria-label={'Zavřít chat'}
            >
              <CloseIcon />
            </button>
          </div>

          {offline && status && (
            <OfflineNotice status={status} compact={hasSession} onBook={() => setOpen(false)} />
          )}

          {!hasSession ? (
            /* ─── Name Input (first visit) ─── */
            <div className={'flex-1 flex flex-col items-center justify-center p-6 gap-4'}>
              <div className={'text-center'}>
                <p className={'text-white font-bold text-sm11 mb-2'}>{'Ahoj!'}</p>
                <p className={'text-gray-400 text-sm'}>{'Jak se jmenujete?'}</p>
              </div>
              <input
                type={'text'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && startSession()}
                placeholder={'Vaše jméno'}
                className={
                  'w-full bg-white/10 text-white px-4 py-3 text-sm outline-none placeholder:text-white/40 border border-white/10 focus:border-primary/50 transition-colors'
                }
                autoFocus
              />
              <button
                type={'button'}
                onClick={startSession}
                disabled={!name.trim()}
                className={
                  'w-full py-3 bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
                }
              >
                {'Začít chat'}
              </button>
            </div>
          ) : (
            <>
              {/* ─── Messages ─── */}
              <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${hideScrollbar}`}>
                {messages.length === 0 && !sending && (
                  <div className={'text-center py-8'}>
                    <p className={'text-white/30 text-sm'}>{'Napište nám zprávu'}</p>
                  </div>
                )}

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'visitor' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-3 py-2 ${
                        msg.sender === 'visitor'
                          ? 'bg-primary text-white'
                          : 'bg-white/10 text-white'
                      }`}
                    >
                      {msg.telegramFileId && (
                        <a
                          href={`${API}/api/chat/file?id=${msg.telegramFileId}`}
                          target={'_blank'}
                          rel={'noopener noreferrer'}
                          className={'block mb-1'}
                        >
                          <img
                            src={`${API}/api/chat/file?id=${msg.telegramFileId}`}
                            alt={''}
                            className={'max-w-[200px] max-h-[200px] object-cover'}
                          />
                        </a>
                      )}
                      {msg.text && (
                        <p className={'text-sm break-words whitespace-pre-wrap'}>{msg.text}</p>
                      )}
                      <p
                        className={`text-[10px] mt-1 ${
                          msg.sender === 'visitor' ? 'text-white/60' : 'text-white/40'
                        }`}
                      >
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}

                {askContact && sessionId && (
                  <ContactCard
                    sessionId={sessionId}
                    visitorName={name}
                    offline={offline}
                    onSaved={saveContact}
                  />
                )}
                {contact && !editingContact && (
                  <ContactSaved contact={contact} onChange={() => setEditingContact(true)} />
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* ─── Image Previews ─── */}
              {imagePreviews.length > 0 && (
                <div className={'px-4 pb-2 flex gap-2 flex-wrap'}>
                  {imagePreviews.map((preview, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <div key={i} className={'relative inline-block'}>
                      <img src={preview} alt={''} className={'h-16 object-cover'} />
                      <button
                        type={'button'}
                        onClick={() => removeImage(i)}
                        className={
                          'absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs leading-none'
                        }
                        aria-label={'Odebrat obrázek'}
                      >
                        {'×'}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* ─── Input Area ─── */}
              <div className={'p-3 border-t border-white/10 flex items-center gap-2'}>
                <input
                  ref={fileInputRef}
                  type={'file'}
                  accept={'image/*'}
                  multiple
                  onChange={handleImageSelect}
                  className={'hidden'}
                />
                <button
                  type={'button'}
                  onClick={() => fileInputRef.current?.click()}
                  className={'text-white/40 hover:text-primary transition-colors flex-shrink-0'}
                  aria-label={'Připojit obrázek'}
                >
                  <ImageIcon />
                </button>
                <textarea
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value)
                    e.target.style.height = 'auto'
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && !('ontouchstart' in window)) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                  placeholder={'Napište zprávu...'}
                  rows={1}
                  className={`flex-1 bg-white/10 text-white px-3 py-2 text-sm outline-none placeholder:text-white/40 border border-white/10 focus:border-primary/50 transition-colors min-w-0 resize-none overflow-y-auto ${hideScrollbar}`}
                  disabled={sending}
                />
                <button
                  type={'button'}
                  onClick={sendMessage}
                  disabled={(!input.trim() && imageFiles.length === 0) || sending}
                  className={
                    'text-primary hover:text-primary/80 transition-colors flex-shrink-0 disabled:opacity-40'
                  }
                  aria-label={'Odeslat zprávu'}
                >
                  <SendIcon />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ─── Floating Bubble + Teaser ─── */}
      {!open && (
        <>
          {/* Teaser popup */}
          {showTeaser && !isBookingPage && (
            <div
              className={
                'fixed bottom-[88px] right-6 z-[9998] animate-in slide-in-from-bottom duration-300'
              }
            >
              <div
                className={
                  'bg-accent text-white px-4 py-3 shadow-2xl border border-white/10 max-w-[260px] cursor-pointer relative'
                }
                onClick={handleOpen}
              >
                <button
                  type={'button'}
                  onClick={(e) => {
                    e.stopPropagation()
                    dismissTeaser()
                  }}
                  className={
                    'absolute top-0 right-0 w-8 h-8 flex items-center justify-center text-white/40 hover:text-white'
                  }
                  aria-label={'Zavřít'}
                >
                  {/* Dvakrát větší než dřívější „×“ v text-xs (~6 px → ~13 px). */}
                  <X size={26} aria-hidden={'true'} />
                </button>
                <p className={'text-sm pr-6'}>{TEASER_MESSAGE.text}</p>
              </div>
              {/* Arrow pointing to bubble */}
              <div className={'flex justify-end pr-5'}>
                <div
                  className={
                    'w-3 h-3 bg-accent border-r border-b border-white/10 rotate-45 -mt-[7px]'
                  }
                />
              </div>
            </div>
          )}

          {/* Chat button */}
          <button
            type={'button'}
            onClick={handleOpen}
            className={
              'fixed bottom-6 right-6 z-[9998] w-14 h-14 bg-accent rounded-full shadow-xl flex items-center justify-center text-white hover:bg-primary/90 transition-all hover:scale-110'
            }
            aria-label={'Otevřít chat'}
          >
            <ChatIcon />
            {(hasUnread || showTeaser) && (
              <span
                className={
                  'absolute top-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-accent animate-pulse'
                }
              />
            )}
          </button>
        </>
      )}
    </>
  )
}
