// Страницы с тёмным фоном (#161615): светлый логотип и гамбургер, без CTA-кнопки.
// Один список для LogoWrap и Buttons — раньше он был скопирован в оба файла, и
// страницы из писем (/rezervace/<token>, /odhlasit/<token>) в него не попали:
// чёрный логотип и иконки сливались с фоном.
export const isDarkPage = (pathname: string): boolean =>
  pathname.includes('/book') ||
  pathname.includes('/cabinet') ||
  pathname.startsWith('/rezervace') ||
  pathname.startsWith('/odhlasit')

// Hlavní stránka během Halloween kampaně (lib/halloween.ts): tmavý hero, takže
// bílé logo a ikony a růžové CTA. `halloween` počítá server (isHalloweenOn)
// a posílá ho sem propem, aby se server a prohlížeč shodly.
export const isHalloweenHome = (pathname: string, halloween: boolean): boolean =>
  halloween && pathname === '/'
