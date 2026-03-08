'use client'

interface HamburgerProps {
  toggled: boolean
  onToggle: () => void
  color: string
  size?: number
  label?: string
}

const Hamburger = ({ toggled, onToggle, color, size = 48, label }: HamburgerProps) => {
  const barWidth = size * 1
  const barHeight = 4
  const gap = size * 0.2

  return (
    <button
      type={'button'}
      onClick={onToggle}
      aria-label={label}
      aria-expanded={toggled}
      className={'relative cursor-pointer flex items-center justify-center'}
      style={{ width: size, height: size }}
    >
      <div className={'relative'} style={{ width: barWidth, height: gap * 2 + barHeight * 3 }}>
        <span
          className={'absolute left-0 block transition-all duration-300 ease-in-out'}
          style={{
            width: barWidth,
            height: barHeight,
            backgroundColor: color,
            top: toggled ? '50%' : 0,
            transform: toggled ? 'translateY(-50%) rotate(45deg)' : 'none',
          }}
        />
        <span
          className={'absolute left-0 block transition-all duration-300 ease-in-out'}
          style={{
            width: barWidth,
            height: barHeight,
            backgroundColor: color,
            top: '50%',
            transform: 'translateY(-50%)',
            opacity: toggled ? 0 : 1,
          }}
        />
        <span
          className={'absolute left-0 block transition-all duration-300 ease-in-out'}
          style={{
            width: barWidth,
            height: barHeight,
            backgroundColor: color,
            bottom: toggled ? 'auto' : 0,
            top: toggled ? '50%' : 'auto',
            transform: toggled ? 'translateY(-50%) rotate(-45deg)' : 'none',
          }}
        />
      </div>
    </button>
  )
}

export default Hamburger
