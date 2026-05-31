'use client'

import type { IAddonGroup, IModifierItem, IModifierResult } from '../../fetch/addonGroupService'

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
  // Which rows have their "info" description expanded (id: `addon:<label>` / `mod:<key>`)
  const [openInfo, setOpenInfo] = useState<Set<string>>(new Set())

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
    const modifiers = group.modifiers ?? []
    const grp = modifiers.find((m) => m.key === key)?.group?.trim()
    setCheckedModifiers((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        // Mutually-exclusive group: deselect any other checked modifier sharing it
        if (grp) {
          for (const other of modifiers) {
            if (other.key !== key && other.group?.trim() === grp) next.delete(other.key)
          }
        }
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

  const options: Array<{ id: string; label: string; priceDiff: number; description?: string }> = [
    { id: 'base', label: 'Základní varianta', priceDiff: 0 },
    ...group.addons.map((addon) => ({
      id: `addon:${addon.label}`,
      label: addon.label,
      priceDiff: addon.price_diff,
      description: addon.description,
    })),
  ]

  const allModifiers = group.modifiers ?? []
  // Свободные модификаторы (без группы) → чекбоксы в «Doplňkové služby»
  const freeModifiers = allModifiers.filter((m) => !m.group?.trim())
  // Модификаторы с группой → каждая группа в свой блок с радио-выбором (один/ни одного)
  const modifierGroupOrder: string[] = []
  const modifierGroups = new Map<string, IModifierItem[]>()
  for (const m of allModifiers) {
    const g = m.group?.trim()
    if (!g) continue
    const existing = modifierGroups.get(g)
    if (existing) {
      existing.push(m)
    } else {
      modifierGroups.set(g, [m])
      modifierGroupOrder.push(g)
    }
  }

  const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s)

  const toggleInfo = (id: string) =>
    setOpenInfo((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  // Small grey "info" badge (same style as the main service list). stopPropagation
  // so tapping it expands the description instead of selecting/toggling the row.
  const renderInfoBadge = (id: string) => (
    <span
      role={'button'}
      onClick={(e) => {
        e.stopPropagation()
        toggleInfo(id)
      }}
      className={
        'inline-block ml-2 align-middle text-[11px] text-accent font-light bg-[#A0A0A0] leading-none py-0.5 px-2 rounded-xl'
      }
    >
      {'info'}
    </span>
  )

  // Одна строка модификатора. radio=true → круглый индикатор (взаимоисключающая
  // группа), иначе квадратный чекбокс. Поведение клика одинаковое (toggleModifier
  // сам снимает другие в группе и позволяет снять выбор повторным кликом).
  const renderModifierRow = (modifier: IModifierItem, radio: boolean) => {
    const isChecked = checkedModifiers.has(modifier.key)
    const isDisabled = !availableModifierKeys.has(modifier.key)
    const active = isChecked && !isDisabled
    const infoId = `mod:${modifier.key}`
    const showInfo = openInfo.has(infoId)
    return (
      <div key={modifier.key} className={'border-t-2 border-[#3C3C3C] border-dotted'}>
        <div
          role={'button'}
          onClick={() => !isDisabled && toggleModifier(modifier.key)}
          className={`flex items-center gap-4 px-4 py-3.5 transition-colors duration-150 ${
            isDisabled
              ? 'opacity-35 cursor-not-allowed'
              : isChecked
                ? 'bg-[#3C3C3C] cursor-pointer'
                : 'hover:bg-[#2e2e2c] cursor-pointer'
          }`}
        >
          {radio ? (
            <span
              className={`shrink-0 flex items-center justify-center w-5 h-5 rounded-full border-2 transition-colors duration-150 ${
                active ? 'border-[#E71E6E]' : 'border-[#A0A0A0]'
              }`}
            >
              {active && <span className={'w-2.5 h-2.5 rounded-full bg-[#E71E6E] block'} />}
            </span>
          ) : (
            <span
              className={`shrink-0 flex items-center justify-center w-5 h-5 rounded border-2 transition-colors duration-150 ${
                active ? 'border-[#E71E6E] bg-[#E71E6E]' : 'border-[#A0A0A0]'
              }`}
            >
              {active && (
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
          )}

          <span className={'flex-1 min-w-0'}>
            <span className={'text-xs1 leading-snug'}>{modifier.label}</span>
            {modifier.description && renderInfoBadge(infoId)}
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
        {showInfo && modifier.description && (
          <p className={'px-4 pb-3.5 -mt-1 text-[#A0A0A0] text-xss leading-snug'}>
            {modifier.description}
          </p>
        )}
      </div>
    )
  }

  // В группе ничего не выбрано (= активна опция «Bez výběru»)
  const isGroupEmpty = (groupName: string) =>
    !(modifierGroups.get(groupName) ?? []).some((m) => checkedModifiers.has(m.key))

  // Снять выбор у всей группы (вернуться к «ничего не выбрано»)
  const clearGroup = (groupName: string) => {
    setCheckedModifiers((prev) => {
      const next = new Set(prev)
      for (const m of modifierGroups.get(groupName) ?? []) next.delete(m.key)
      return next
    })
  }

  return (
    <div className={'pb-17'}>
      {/* Список основных опций (радиокнопки) */}
      <div className={'bg-[#252523] rounded-special-small overflow-hidden'}>
        {group.title && <p className={'px-4 pt-3.5 pb-1 text-xss text-[#A0A0A0]'}>{group.title}</p>}
        {options.map((option, index) => {
          const isSelected = selectedIndex === index
          const showInfo = openInfo.has(option.id)
          return (
            <div
              key={option.id}
              className={index > 0 ? 'border-t-2 border-[#3C3C3C] border-dotted' : ''}
            >
              <div
                role={'button'}
                onClick={() => handleSelectIndex(index)}
                className={`flex items-center gap-4 px-4 py-4 cursor-pointer transition-colors duration-150 ${
                  isSelected ? 'bg-[#3C3C3C]' : 'hover:bg-[#2e2e2c]'
                }`}
              >
                <span
                  className={`shrink-0 flex items-center justify-center w-5 h-5 rounded-full border-2 transition-colors duration-150 ${
                    isSelected ? 'border-[#E71E6E]' : 'border-[#A0A0A0]'
                  }`}
                >
                  {isSelected && <span className={'w-2.5 h-2.5 rounded-full bg-[#E71E6E] block'} />}
                </span>

                <span className={'flex-1 min-w-0'}>
                  <span className={'text-xs1 leading-snug'}>{option.label}</span>
                  {option.description && renderInfoBadge(option.id)}
                </span>

                {option.priceDiff > 0 && (
                  <span
                    className={
                      'shrink-0 text-xss font-semibold text-[#E71E6E] bg-[#E71E6E1A] border border-[#E71E6E40] rounded-xl px-2 py-1 whitespace-nowrap'
                    }
                  >
                    {`+${option.priceDiff} Kč`}
                  </span>
                )}
              </div>
              {showInfo && option.description && (
                <p className={'px-4 pb-3.5 -mt-1 text-[#A0A0A0] text-xss leading-snug'}>
                  {option.description}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Взаимоисключающие группы дополнений — отдельный блок с радио-выбором */}
      {modifierGroupOrder.map((groupName) => {
        const noneSelected = isGroupEmpty(groupName)
        return (
          <div
            key={groupName}
            className={'mt-2.5 bg-[#252523] rounded-special-small overflow-hidden'}
          >
            <p className={'px-4 pt-3.5 pb-1 text-xss text-[#A0A0A0]'}>{capitalize(groupName)}</p>

            {/* Опция «ничего не выбрано» — позволяет отменить выбор в группе */}
            <div
              role={'button'}
              onClick={() => clearGroup(groupName)}
              className={`flex items-center gap-4 px-4 py-3.5 cursor-pointer transition-colors duration-150 ${
                noneSelected ? 'bg-[#3C3C3C]' : 'hover:bg-[#2e2e2c]'
              }`}
            >
              <span
                className={`shrink-0 flex items-center justify-center w-5 h-5 rounded-full border-2 transition-colors duration-150 ${
                  noneSelected ? 'border-[#E71E6E]' : 'border-[#A0A0A0]'
                }`}
              >
                {noneSelected && <span className={'w-2.5 h-2.5 rounded-full bg-[#E71E6E] block'} />}
              </span>
              <span className={'flex-1 min-w-0'}>
                <span className={'block text-xs1 leading-snug text-[#A0A0A0]'}>{'Bez výběru'}</span>
              </span>
            </div>

            {(modifierGroups.get(groupName) ?? []).map((modifier) =>
              renderModifierRow(modifier, true),
            )}
          </div>
        )
      })}

      {/* Свободные дополнения — чекбоксы */}
      {freeModifiers.length > 0 && (
        <div className={'mt-2.5 bg-[#252523] rounded-special-small overflow-hidden'}>
          <p className={'px-4 pt-3.5 pb-1 text-xss text-[#A0A0A0]'}>{'Doplňkové služby'}</p>
          {freeModifiers.map((modifier) => renderModifierRow(modifier, false))}
        </div>
      )}

      {/* Фиксированный блок внизу: цена + кнопка */}
      <div
        className={'w-full pt-3 pb-5'}
        style={{ backgroundImage: 'linear-gradient(180deg, #16161500 0%, #161615 70%)' }}
      >
        <div className={'bg-[#252523] rounded-special-small px-4 py-4'}>
          <div className={'flex items-center justify-between mb-4'}>
            <span className={'text-[#A0A0A0] text-xs1'}>{'Celkem'}</span>
            <span
              className={'text-primary font-bold text-resMd1 tabular-nums'}
            >{`${total} Kč`}</span>
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
    </div>
  )
}
