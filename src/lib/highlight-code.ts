import { codeToHtml } from 'shiki'

/**
 * Highlight the code provided with shiki.js
 * @param code The code to highlight.
 * @returns The highlighted HTML code.
 */
export async function highlightCode(code: string) {
  const html = await codeToHtml(code, {
    lang: 'tsx',
    theme: 'min-dark',
    transformers: [
      {
        code(node) {
          node.properties['data-line-numbers'] = ''
        },
      },
    ],
  })

  return html
}
