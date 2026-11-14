/**
 * Události mezi tlačítkem „Napiš nám do chatu“ (hlavní stránka), chatem a lištou
 * cookies (s286). Chat se načítá až po souhlasu — bez něj tlačítko požádá lištu,
 * ať se znovu ukáže.
 */
export const OPEN_CHAT_EVENT = 'barbitch:open-chat'
export const CONSENT_REQUEST_EVENT = 'barbitch:cookie-consent-request'
