'use client'

import type { IAddonGroup, IModifierResult } from '../../fetch/addonGroupService'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface ExtrasSelectorProps {
  serviceId: string
  group: IAddonGroup
}

const findModifierResult = (
  modifierResults: IModifierResult[],
  checkedKeys: Set<string>,
): string | null => {
  if (checkedKeys.size === 0) return null
  const sorted = [...checkedKeys].sort().join(',')
  return modifierResults.find((mr) => mr.modifier_keys === sorted)?.result_noona_id ?? null
}

// Возвращает Set ключей modifier, доступных для данного варианта (по наличию записей в modifier_results)
const getAvailableModifierKeys = (idx: number, group: IAddonGroup): Set<string> => {
  const results =
    idx === 0
      ? (group.base_modifier_results ?? [])
      : (group.addons[idx - 1]?.modifier_results ?? [])

  const available = new Set<string>()
  for (const mr of results) {
    for (const k of mr.modifier_keys.split(',')) {
      available.add(k.trim())
    }
  }
  return available
}

export const ExtrasSelector = ({ serviceId, group }: ExtrasSelectorProps) => {
  const router = useRouter()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [checkedModifiers, setCheckedModifiers] = useState<Set<string>>(new Set())

  const hasModifiers = (group.modifiers ?? []).length > 0

  const handleSelectIndex = (idx: number) => {
    const available = getAvailableModifierKeys(idx, group)
    setCheckedModifiers((prev) => {
      const next = new Set(prev)
      for (const key of next) {
        if (!available.has(key)) next.delete(key)
      }
      return next
    })
    setSelectedIndex(idx)
  }

  const toggleModifier = (key: string) => {
    setCheckedModifiers((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const getResult = () => {
    const modifierPriceDiff = [...checkedModifiers].reduce((sum, key) => {
      const mod = (group.modifiers ?? []).find((m) => m.key === key)
      return sum + (mod?.price_diff ?? 0)
    }, 0)

    if (selectedIndex === 0) {
      const overrideId =
        checkedModifiers.size > 0
          ? findModifierResult(group.base_modifier_results ?? [], checkedModifiers)
          : null
      return {
        href: `/book/${overrideId ?? serviceId}`,
        total: group.base_price + modifierPriceDiff,
        hasOverride: overrideId !== null || checkedModifiers.size === 0,
      }
    } else {
      const addon = group.addons[selectedIndex - 1]
      const overrideId =
        checkedModifiers.size > 0
          ? findModifierResult(addon.modifier_results ?? [], checkedModifiers)
          : null
      return {
        href: `/book/${overrideId ?? addon.result_noona_id}`,
        total: group.base_price + addon.price_diff + modifierPriceDiff,
        hasOverride: overrideId !== null || checkedModifiers.size === 0,
      }
    }
  }

  const { href, total, hasOverride } = getResult()
  const availableModifierKeys = getAvailableModifierKeys(selectedIndex, group)

  const options = [
    { label: 'Základní varianta', priceDiff: 0 },
    ...group.addons.map((addon) => ({
      label: addon.label,
      priceDiff: addon.price_diff,
    })),
  ]

  return (
    <div>
      {/* Название услуги под заголовком */}
      {group.title && (
        <p className={'text-center text-[#A0A0A0] text-resXs mb-5 -mt-2'}>{group.title}</p>
      )}

      {/* Список основных опций (радиокнопки) */}
      <div className={'bg-[#252523] rounded-special-small overflow-hidden'}>
        {options.map((option, index) => {
          const isSelected = selectedIndex === index
          return (
            <div
              key={index}
              role={'button'}
              onClick={() => handleSelectIndex(index)}
              className={`flex items-center gap-4 px-4 py-4 cursor-pointer transition-colors duration-150 ${
                index > 0 ? 'border-t-2 border-[#3C3C3C] border-dotted' : ''
              } ${isSelected ? 'bg-[#3C3C3C]' : 'hover:bg-[#2e2e2c]'}`}
            >
              <span
                className={`shrink-0 flex items-center justify-center w-5 h-5 rounded-full border-2 transition-colors duration-150 ${
                  isSelected ? 'border-[#E71E6E]' : 'border-[#A0A0A0]'
                }`}
              >
                {isSelected && <span className={'w-2.5 h-2.5 rounded-full bg-[#E71E6E] block'} />}
              </span>

              <span className={'flex-1 min-w-0'}>
                <span className={'block text-xs1 leading-snug'}>{option.label}</span>
              </span>

              {option.priceDiff > 0 ? (
                <span
                  className={
                    'shrink-0 text-xss font-semibold text-[#E71E6E] bg-[#E71E6E1A] border border-[#E71E6E40] rounded-xl px-2 py-1 whitespace-nowrap'
                  }
                >
                  {`+${option.priceDiff} Kč`}
                </span>
              ) : (
                <span className={'shrink-0 text-xss text-[#A0A0A0] whitespace-nowrap'}>{'—'}</span>
              )}
            </div>
          )
        })}
      </div>

      {/* Чекбоксы modifiers */}
      {hasModifiers && (
        <div className={'mt-2.5 bg-[#252523] rounded-special-small overflow-hidden'}>
          <p className={'px-4 pt-3.5 pb-1 text-xss text-[#A0A0A0]'}>{'Doplňkové služby'}</p>
          {(group.modifiers ?? []).map((modifier) => {
            const isChecked = checkedModifiers.has(modifier.key)
            const isDisabled = !availableModifierKeys.has(modifier.key)
            return (
              <div
                key={modifier.key}
                role={'button'}
                onClick={() => !isDisabled && toggleModifier(modifier.key)}
                className={`flex items-center gap-4 px-4 py-3.5 transition-colors duration-150 border-t-2 border-[#3C3C3C] border-dotted ${
                  isDisabled
                    ? 'opacity-35 cursor-not-allowed'
                    : isChecked
                      ? 'bg-[#3C3C3C] cursor-pointer'
                      : 'hover:bg-[#2e2e2c] cursor-pointer'
                }`}
              >
                <span
                  className={`shrink-0 flex items-center justify-center w-5 h-5 rounded border-2 transition-colors duration-150 ${
                    isDisabled
                      ? 'border-[#A0A0A0]'
                      : isChecked
                        ? 'border-[#E71E6E] bg-[#E71E6E]'
                        : 'border-[#A0A0A0]'
                  }`}
                >
                  {isChecked && !isDisabled && (
                    <svg width={'11'} height={'8'} viewBox={'0 0 11 8'} fill={'none'}>
                      <path
                        d={'M1 3.5L4 6.5L10 1'}
                        stroke={'white'}
                        strokeWidth={'1.8'}
                        strokeLinecap={'round'}
                        strokeLinejoin={'round'}
                      />
                    </svg>
                  )}
                </span>

                <span className={'flex-1 min-w-0'}>
                  <span className={'block text-xs1 leading-snug'}>{modifier.label}</span>
                </span>

                <span
                  className={`shrink-0 text-xss font-semibold rounded-xl px-2 py-1 whitespace-nowrap ${
                    isDisabled
                      ? 'text-[#A0A0A0] bg-[#A0A0A01A] border border-[#A0A0A040]'
                      : 'text-[#E71E6E] bg-[#E71E6E1A] border border-[#E71E6E40]'
                  }`}
                >
                  {`+${modifier.price_diff} Kč`}
                </span>
              </div>
            )
          })}
        </div>
      )}

      {/* Итоговая цена + кнопка */}
      <div className={'mt-2.5 bg-[#252523] rounded-special-small px-4 py-4'}>
        <div className={'flex items-center justify-between mb-4'}>
          <span className={'text-[#A0A0A0] text-xs1'}>{'Celkem'}</span>
          <span className={'text-primary font-bold text-resMd1 tabular-nums'}>{`${total} Kč`}</span>
        </div>
        <button
          onClick={() => router.push(href)}
          type={'button'}
          disabled={!hasOverride}
          className={`w-full transition-colors duration-150 text-white font-semibold text-xs1 py-3.5 rounded-special-small ${
            hasOverride
              ? 'bg-[#E71E6E] hover:bg-[#c9195f] active:bg-[#b01555]'
              : 'bg-[#5a5a5a] cursor-not-allowed'
          }`}
        >
          {'Pokračovat'}
        </button>
      </div>
    </div>
  )
}
