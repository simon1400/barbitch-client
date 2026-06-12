/**
 * Serialize an object for safe embedding inside a
 * <script type="application/ld+json"> tag.
 *
 * JSON.stringify does NOT escape `<`, so a CMS-controlled field containing
 * `</script>` could break out of the tag and inject markup (stored XSS).
 * Escaping `<`, `>` and `&` makes the payload inert inside the script context
 * while remaining valid JSON-LD.
 */
export const jsonLd = (data: unknown): string =>
  JSON.stringify(data)
    .replaceAll('<', '\\u003c')
    .replaceAll('>', '\\u003e')
    .replaceAll('&', '\\u0026')
