'use client'

import { OPEN_CHAT_EVENT } from 'lib/chatEvents'

/** Otevře chat (components/ChatWidget); bez souhlasu s cookies nejdřív lištu souhlasu. */
const OpenChatButton = () => (
  <button
    type={'button'}
    onClick={() => window.dispatchEvent(new Event(OPEN_CHAT_EVENT))}
    className={
      'inline-flex items-center justify-center h-12 px-6 text-[14px] font-extrabold uppercase whitespace-nowrap bg-accent text-white hover:text-primary focus-visible:text-primary focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-accent [transition-property:color] [transition-duration:200ms]'
    }
  >
    {'Napiš nám do chatu'}
  </button>
)

export default OpenChatButton
