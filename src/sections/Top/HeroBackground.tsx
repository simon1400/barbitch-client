'use client'

import { motion, useSpring, useTransform } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'

/* ── Lash/brush stroke paths ──────────────────────────────────── */

const LASH_PATHS = [
  'M0,80 Q30,10 60,30 Q90,50 120,5',
  'M0,60 Q40,5 80,20 Q110,35 140,0',
  'M0,50 Q25,0 50,15 Q80,30 100,2',
  'M0,70 Q35,15 70,25 Q100,35 130,8',
  'M0,40 Q20,0 45,10 Q70,22 90,0',
  'M0,90 Q50,20 100,50 Q130,10 160,30',
  'M0,100 Q60,30 120,60',
]

interface LashStroke {
  id: number
  path: string
  x: number
  y: number
  rotation: number
  scale: number
  duration: number
  delay: number
}

interface Sparkle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
}

function generateLashes(count: number): LashStroke[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    // eslint-disable-next-line sonarjs/pseudo-random
    path: LASH_PATHS[Math.floor(Math.random() * LASH_PATHS.length)],
    // eslint-disable-next-line sonarjs/pseudo-random
    x: Math.random() * 90,
    // eslint-disable-next-line sonarjs/pseudo-random
    y: Math.random() * 90,
    // eslint-disable-next-line sonarjs/pseudo-random
    rotation: Math.random() * 360,
    // eslint-disable-next-line sonarjs/pseudo-random
    scale: 0.8 + Math.random() * 1.5,
    // eslint-disable-next-line sonarjs/pseudo-random
    duration: 10 + Math.random() * 8,
    // eslint-disable-next-line sonarjs/pseudo-random
    delay: Math.random() * 8,
  }))
}

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
  const [lashes] = useState(() => generateLashes(12))
  const [sparkles] = useState(() => generateSparkles(35))

  const rawX = useSpring(0, { stiffness: 30, damping: 20 })
  const rawY = useSpring(0, { stiffness: 30, damping: 20 })
  const glowX = useTransform(rawX, (v) => v - 250)
  const glowY = useTransform(rawY, (v) => v - 250)

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current || !isDesktop) return
      const rect = containerRef.current.getBoundingClientRect()
      rawX.set(e.clientX - rect.left)
      rawY.set(e.clientY - rect.top)
    },
    [isDesktop, rawX, rawY],
  )

  const visibleLashes = isDesktop ? lashes : lashes.slice(0, 6)
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

      {/* Lash/brush strokes — dark strokes for contrast on pink */}
      <div className={'absolute inset-0'}>
        {visibleLashes.map((lash) => (
          <motion.svg
            key={lash.id}
            className={'absolute'}
            style={{
              left: `${lash.x}%`,
              top: `${lash.y}%`,
            }}
            width={'200'}
            height={'120'}
            viewBox={'0 0 160 100'}
            fill={'none'}
            initial={{ opacity: 0, scale: 0.5, rotate: lash.rotation }}
            animate={{
              opacity: [0, 0.15, 0.15, 0],
              scale: [0.5 * lash.scale, lash.scale, lash.scale, 0.5 * lash.scale],
              rotate: [lash.rotation, lash.rotation + 5, lash.rotation - 5, lash.rotation],
            }}
            transition={{
              duration: lash.duration,
              repeat: Infinity,
              delay: lash.delay,
              ease: 'easeInOut',
            }}
          >
            <motion.path
              d={lash.path}
              stroke={'rgba(80,0,30,0.6)'}
              strokeWidth={'3'}
              strokeLinecap={'round'}
              fill={'none'}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 1, 1, 0] }}
              transition={{
                duration: lash.duration,
                repeat: Infinity,
                delay: lash.delay,
                ease: 'easeInOut',
                times: [0, 0.35, 0.65, 1],
              }}
            />
          </motion.svg>
        ))}
      </div>

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

      {/* Mouse-following glow — desktop */}
      {isDesktop && (
        <motion.div
          className={'absolute pointer-events-none w-[500px] h-[500px] rounded-full'}
          style={{
            background:
              'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,200,230,0.06) 40%, transparent 65%)',
            left: glowX,
            top: glowY,
          }}
        />
      )}
    </div>
  )
}
