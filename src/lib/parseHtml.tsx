import type { DOMNode, HTMLReactParserOptions } from 'html-react-parser'

import parse, { domToReact, Element } from 'html-react-parser'

const INTERNAL_HOSTS = ['barbitch.cz', 'www.barbitch.cz']

function isInternalLink(href: string): boolean {
  if (href.startsWith('/') || href.startsWith('#')) return true
  try {
    const url = new URL(href)
    return INTERNAL_HOSTS.includes(url.hostname)
  } catch {
    return true
  }
}

/** Je uvnitř uzlu další odkaz? */
function containsLink(node: Element): boolean {
  return node.children.some(
    (child) => child instanceof Element && (child.name === 'a' || containsLink(child)),
  )
}

/** `<use href="/cdn/…">` uvnitř — sprite z cizího webu. */
function usesForeignSprite(node: Element): boolean {
  return node.children.some(
    (child) =>
      child instanceof Element &&
      ((child.name === 'use' &&
        (child.attribs.href || child.attribs['xlink:href'] || '').startsWith('/cdn/')) ||
        usesForeignSprite(child)),
  )
}

export function parseHtml(html: string, trim = true) {
  const options: HTMLReactParserOptions = {
    trim,
    replace(domNode: DOMNode) {
      // Ikony vložené z ChatGPT (`<svg><use href="/cdn/assets/sprites-core-….svg#…">`)
      // odkazují na soubor, který u nás není → 404 v konzoli. Nic nezobrazují, zahodit.
      if (domNode instanceof Element && domNode.name === 'svg' && usesForeignSprite(domNode)) {
        return <></>
      }
      if (domNode instanceof Element && domNode.name === 'a') {
        // Odkaz v odkazu (text vložený z ChatGPT: `<a class="decorated-link"><a href=…>…</a></a>`)
        // HTML nedovoluje — prohlížeč ho přestaví jinak než server a React hlásí
        // chybu hydratace #418. Vnější obal zahodíme, vnitřní odkaz zůstane.
        if (containsLink(domNode)) {
          return <>{domToReact(domNode.children as DOMNode[], options)}</>
        }
        const href = domNode.attribs.href || ''
        if (isInternalLink(href)) {
          delete domNode.attribs.target
          delete domNode.attribs.rel
        }
      }
    },
  }
  return parse(html, options)
}
