'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'

interface Sparkle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
}

interface TrailSparkle {
  id: number
  x: number
  y: number
  size: number
  rotation: number
  driftX: number
  driftY: number
  duration: number
  shape: number
  tint: number
}

const TRAIL_SHAPES = [
  // 4-point star
  'M10 0 L11.5 8 L20 10 L11.5 12 L10 20 L8.5 12 L0 10 L8.5 8 Z',
  // 6-point star
  'M10 0 L12 7 L19 7 L13.5 11 L15.5 18 L10 14 L4.5 18 L6.5 11 L1 7 L8 7 Z',
  // Round dot
  'M10 5 A5 5 0 1 1 10 15 A5 5 0 1 1 10 5 Z',
  // Diamond
  'M10 2 L16 10 L10 18 L4 10 Z',
]

const TRAIL_TINTS = [
  'rgba(255,255,255,0.95)',
  'rgba(255,225,240,0.95)',
  'rgba(255,200,225,0.95)',
  'rgba(255,240,180,0.9)',
]

function generateSparkles(count: number): Sparkle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    // eslint-disable-next-line sonarjs/pseudo-random
    x: Math.random() * 100,
    // eslint-disable-next-line sonarjs/pseudo-random
    y: Math.random() * 100,
    // eslint-disable-next-line sonarjs/pseudo-random
    size: 6 + Math.random() * 12,
    // eslint-disable-next-line sonarjs/pseudo-random
    duration: 2.5 + Math.random() * 3,
    // eslint-disable-next-line sonarjs/pseudo-random
    delay: Math.random() * 10,
  }))
}

export default function HeroBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDesktop, setIsDesktop] = useState(false)
  const [sparkles] = useState(() => generateSparkles(35))
  const [trail, setTrail] = useState<TrailSparkle[]>([])
  const trailIdRef = useRef(0)
  const lastSpawnRef = useRef(0)

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current || !isDesktop) return
      const now = performance.now()
      if (now - lastSpawnRef.current < 28) return
      lastSpawnRef.current = now

      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // eslint-disable-next-line sonarjs/pseudo-random
      const burst = 2 + Math.floor(Math.random() * 2)
      const newSparkles: TrailSparkle[] = []
      for (let i = 0; i < burst; i++) {
        newSparkles.push({
          id: trailIdRef.current++,
          // eslint-disable-next-line sonarjs/pseudo-random
          x: x + (Math.random() - 0.5) * 24,
          // eslint-disable-next-line sonarjs/pseudo-random
          y: y + (Math.random() - 0.5) * 24,
          // eslint-disable-next-line sonarjs/pseudo-random
          size: 6 + Math.random() * 12,
          // eslint-disable-next-line sonarjs/pseudo-random
          rotation: Math.random() * 180,
          // eslint-disable-next-line sonarjs/pseudo-random
          driftX: (Math.random() - 0.5) * 60,
          // eslint-disable-next-line sonarjs/pseudo-random
          driftY: -20 - Math.random() * 50,
          // eslint-disable-next-line sonarjs/pseudo-random
          duration: 0.9 + Math.random() * 0.7,
          // eslint-disable-next-line sonarjs/pseudo-random
          shape: Math.floor(Math.random() * TRAIL_SHAPES.length),
          // eslint-disable-next-line sonarjs/pseudo-random
          tint: Math.floor(Math.random() * TRAIL_TINTS.length),
        })
      }
      setTrail((prev) => [...prev.slice(-60), ...newSparkles])
    },
    [isDesktop],
  )

  const removeTrail = useCallback((id: number) => {
    setTrail((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const visibleSparkles = isDesktop ? sparkles : sparkles.slice(0, 18)

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={'absolute inset-0 overflow-hidden'}
      aria-hidden={'true'}
    >
      {/* Base gradient */}
      <div
        className={
          'absolute inset-0 bg-gradient-to-t from-[rgba(231,30,110,1)] to-[rgba(255,0,101,0.5)]'
        }
      />

      {/* Glitter sparkles — 4-point stars */}
      <div className={'absolute inset-0'}>
        {visibleSparkles.map((s) => (
          <motion.div
            key={s.id}
            className={'absolute'}
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
            }}
            animate={{
              opacity: [0, 0.8, 1, 0.8, 0],
              scale: [0, 1, 1.3, 1, 0],
              rotate: [0, 45, 90, 135, 180],
            }}
            transition={{
              duration: s.duration,
              repeat: Infinity,
              delay: s.delay,
              ease: 'easeInOut',
            }}
          >
            <svg viewBox={'0 0 20 20'} className={'w-full h-full'}>
              <path
                d={'M10 0 L11.5 8 L20 10 L11.5 12 L10 20 L8.5 12 L0 10 L8.5 8 Z'}
                fill={'rgba(255,255,255,0.9)'}
              />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Mouse-following glitter trail — desktop */}
      {isDesktop && (
        <div className={'absolute inset-0 pointer-events-none'}>
          <AnimatePresence>
            {trail.map((t) => (
              <motion.div
                key={t.id}
                className={'absolute'}
                style={{
                  left: t.x - t.size / 2,
                  top: t.y - t.size / 2,
                  width: t.size,
                  height: t.size,
                  filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.6))',
                }}
                initial={{
                  opacity: 0,
                  scale: 0,
                  rotate: t.rotation,
                  x: 0,
                  y: 0,
                }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  scale: [0, 1.2, 1, 0.4],
                  rotate: t.rotation + 90,
                  x: t.driftX,
                  y: t.driftY,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: t.duration,
                  ease: 'easeOut',
                  times: [0, 0.2, 0.6, 1],
                }}
                onAnimationComplete={() => removeTrail(t.id)}
              >
                <svg viewBox={'0 0 20 20'} className={'w-full h-full'}>
                  <path d={TRAIL_SHAPES[t.shape]} fill={TRAIL_TINTS[t.tint]} />
                </svg>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
