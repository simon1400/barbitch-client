import { Buffer } from 'node:buffer'

// Jeden soubor z formuláře jako příloha e-mailu (Resend): životopis z kariéry,
// logo z firemní poptávky. Velikost a typ hlídá server — `accept` v prohlížeči
// se dá obejít.

export interface FormAttachment {
  filename: string
  content: Buffer
}

export type ParsedAttachment =
  | { ok: true; attachment: FormAttachment | null }
  | { ok: false; status: number; error: string }

export const parseFormAttachment = async (
  value: FormDataEntryValue | null,
  {
    maxBytes,
    allowedTypes,
    fallbackName,
    label,
  }: {
    maxBytes: number
    allowedTypes: ReadonlySet<string>
    /** Název souboru, když prohlížeč žádný nepošle. */
    fallbackName: string
    /** Do textu chyby („Resume too large“, „Logo too large“). */
    label: string
  },
): Promise<ParsedAttachment> => {
  if (!(value instanceof File) || value.size === 0) return { ok: true, attachment: null }
  if (value.size > maxBytes) return { ok: false, status: 413, error: `${label} too large` }
  if (value.type && !allowedTypes.has(value.type)) {
    return { ok: false, status: 415, error: `Unsupported ${label.toLowerCase()} type` }
  }
  const filename = (value.name || fallbackName).replaceAll(/[^\w.\-() ]/g, '_').slice(0, 150)
  return { ok: true, attachment: { filename, content: Buffer.from(await value.arrayBuffer()) } }
}
