// Pravidla voucheru v e-mailech (objednávka i „voucher je aktivní“) — jeden text
// pro obě písma. Voucher na službu pokrývá službu celou, na částku jen svou hodnotu.

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

/** Položky <li> pravidel; `lastLine` — poslední řádek, liší se podle písma. */
export const voucherRulesHtml = (serviceName: string | null | undefined, lastLine: string) => {
  const service = serviceName?.trim()
  const lines = service
    ? [
        `Voucher platí na jednu návštěvu se službou „${escapeHtml(service)}“ v plné výši – nic se nedoplácí.`,
        'Doplňky nad rámec služby (další design, delší délka apod.) se doplácejí podle ceníku.',
        'Chce-li obdarovaná jinou službu, uplatníme voucher v jeho hodnotě; rozdíl se doplácí, nebo nevrací.',
      ]
    : [
        'Voucher lze uplatnit jednorázově na libovolnou službu z naší nabídky.',
        'Je-li cena služby nižší, rozdíl se nevrací.',
        'Je-li cena vyšší, rozdíl doplatíte na místě.',
      ]
  return [...lines, lastLine].map((line) => `<li>${line}</li>`).join('\n                  ')
}

/** Řádek „Služba:“ do tabulky detailů voucheru (prázdný u voucheru na částku). */
export const serviceRowHtml = (serviceName: string | null | undefined, padding: string) => {
  const service = serviceName?.trim()
  if (!service) return ''
  return `<tr>
                          <td style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#bdbdbd;padding:${padding};">
                            <strong style="color:#ffffff;">Služba:</strong> ${escapeHtml(service)}
                          </td>
                        </tr>`
}
