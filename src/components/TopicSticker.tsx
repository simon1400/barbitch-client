/**
 * Růžová nálepka tématu článku (s286 na hlavní, od s291 i na /blog). Prázdný text = nic.
 */
export const TopicSticker = ({ text, className = '' }: { text: string; className?: string }) =>
  text ? (
    <span
      className={`inline-block bg-[#ff6aa0] text-accent font-extrabold uppercase tracking-[1px] ${className}`}
    >
      {text}
    </span>
  ) : null
