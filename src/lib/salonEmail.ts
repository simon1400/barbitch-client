/**
 * Kam poslat oznámení z formuláře (kariéra, firemní poptávka): vlastní env
 * má přednost, pak RESEND_BCC_EMAIL, jinak e-mail salonu ze Strapi.
 */
export const resolveSalonEmail = async (envKey: string): Promise<string | null> => {
  const fromEnv = process.env[envKey] || process.env.RESEND_BCC_EMAIL
  if (fromEnv) return fromEnv

  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_APP_API || process.env.APP_API || 'https://strapi.barbitch.cz'
    const res = await fetch(`${apiUrl}/api/contact?fields[0]=email`, {
      next: { revalidate: 3600 },
    })
    const json = await res.json()
    return json?.data?.email || null
  } catch {
    return null
  }
}
