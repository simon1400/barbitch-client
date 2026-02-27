export const PriceBadge = ({ diff }: { diff: number }) => (
  <span
    className={
      'shrink-0 inline-block text-[10px] font-semibold text-primary bg-[#E71E6E14] border border-[#E71E6E30] rounded-full px-2 py-0.5 whitespace-nowrap'
    }
  >
    {`+${diff} Kč`}
  </span>
)
