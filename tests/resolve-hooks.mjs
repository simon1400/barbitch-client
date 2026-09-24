// Hook pro `node --test`: aby šel načíst skutečný src/middleware.ts bez buildu.
// Next/TS importy píšou bez přípony a přes baseUrl (`lib/...`) — Node v ESM to
// sám nevyřeší, tady to doplníme.
import { registerHooks } from 'node:module'
import { pathToFileURL } from 'node:url'

const SRC = pathToFileURL(`${process.cwd()}/src/`).href

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === 'next/server') return nextResolve('next/server.js', context)
    if (specifier.startsWith('lib/')) return nextResolve(`${SRC}${specifier}.ts`, context)
    return nextResolve(specifier, context)
  },
})
