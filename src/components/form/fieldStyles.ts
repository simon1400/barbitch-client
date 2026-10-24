// Styly polí formulářů — jeden zdroj, žádné kopie po stránkách.
// `booking*` — styl z rezervace (/book → „Vaše informace“): rezervace, odhlášení
// z e-mailů, firemní poptávka. Pole patří na tmavou kartu #252523.
// `soft*` — světlá pole na bílé stránce: objednávka dárkového voucheru.

export const BOOKING_CARD = 'bg-[#252523] rounded-special-small'

export const bookingLabelCls = (error?: boolean) =>
  `block mb-1 text-book font-medium ${error ? 'text-[#E71E1E]' : 'text-[#A0A0A0]'}`

/** Rám a barvy pole; výšku/odsazení si doplní input (`h-10 px-3.5`) nebo textarea. */
export const bookingFieldCls = (error?: boolean) =>
  `bg-[#161615] border block w-full ${
    error ? 'border-[#E71E1E]' : 'border-[#4A4A4A]'
  } outline-none focus:border-[#929292] rounded-special-small text-book text-white placeholder:text-[#6f6f6f]`

export const bookingTextareaCls = (error?: boolean) =>
  `${bookingFieldCls(error)} h-[90px] resize-none p-3.5`

export const bookingHintCls = 'mt-1 text-[12px] leading-[16px] text-[#7a7a7a]'
export const bookingErrorCls = 'mt-1 block text-[12px] leading-[16px] text-[#E71E1E]'

export const softLabelCls = (error?: boolean) =>
  `block mb-2 text-[16px] leading-[22px] font-bold ${error ? 'text-red-500' : ''}`

/** Rám a barvy pole; výšku/odsazení si doplní input (`h-[50px] px-5`) nebo textarea. */
export const softFieldCls = (error?: boolean) =>
  `w-full rounded-[5px] bg-[#f6f6f4] border-[1.5px] ${
    error ? 'border-red-500' : 'border-[#1616151A]'
  } text-[16px] leading-[22px] font-medium text-accent placeholder:text-[#767676] outline-none focus:outline focus:outline-2 focus:outline-primary focus:-outline-offset-1`

export const softTextareaCls = (error?: boolean) =>
  `${softFieldCls(error)} h-[110px] resize-none px-5 py-3.5`

export const softHintCls = 'mt-1.5 text-[13px] leading-[19px] font-medium text-[#767676]'
export const softErrorCls = 'mt-1 block font-bold text-xss text-red-500'
