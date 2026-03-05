import parse, { type DOMNode, domToReact, Element } from 'html-react-parser'

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

export function parseHtml(html: string, trim = true) {
  return parse(html, {
    trim,
    replace(domNode: DOMNode) {
      if (domNode instanceof Element && domNode.name === 'a') {
        const href = domNode.attribs.href || ''
        if (isInternalLink(href)) {
          delete domNode.attribs.target
          delete domNode.attribs.rel
        }
      }
    },
  })
}
