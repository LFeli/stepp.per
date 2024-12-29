import type { Root } from 'mdast'
import { toc } from 'mdast-util-toc'
import { remark } from 'remark'
import type { Node, Parent } from 'unist'
import { visit } from 'unist-util-visit'
import type { VFile } from 'vfile'

// Custom types for AST on Markdown
type TextNode = Node & { value: string }
type LinkNode = Node & { url: string }
type ListNode = Parent & { children: Node[] }
type ListItemNode = Parent & { children: Node[] }

// Constant text node types
const TEXT_NODE_TYPES = ['text', 'emphasis', 'strong', 'inlineCode']

export interface TocItem {
  title: string
  url?: string
  items?: TocItem[]
}

export interface TocItems {
  items?: TocItem[]
}

/**
 * Normalizes a string by:
 * - Removing accents
 * - Replacing spaces with dashes
 * - Converting to lowercase
 * - Replacing 'ç' with 'c'
 * Useful for generating URL-friendly slugs (mainly pt-BR url's).
 * @param text The string to normalize.
 * @returns Normalized string.
 */
function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Removes diacritical marks
    .replace(/ç/g, 'c') // Replaces 'ç' with 'c'
    .replace(/\s+/g, '-') // Replaces spaces with dashes
    .toLowerCase()
}

/**
 * Extract and flatten content of a Markdown node
 * @param node - Node in the Markdown tree
 * @returns Concatenated text extracted from the node
 */
function flattenNode(node: Node): string {
  const extractedText: string[] = []

  visit(node, (child: Node) => {
    if (TEXT_NODE_TYPES.includes(child.type)) {
      extractedText.push((child as TextNode).value || '')
    }
  })

  return extractedText.join('')
}

/**
 * Process a Markdown node to extract information for the TOC
 * @param node - Current node in the tree
 * @param current - Structure updated recursively with the extracted data
 */
function extractTocItems(node: Node | null, current: TocItem): TocItem {
  if (!node) {
    return current
  }

  // Process paragraph for titles and links
  if (node.type === 'paragraph') {
    visit(node, (child: Node) => {
      if (child.type === 'link') {
        current.url = normalizeText((child as LinkNode).url || '')
        current.title = flattenNode(node)
      } else if (child.type === 'text') {
        current.title = flattenNode(node)
        current.url = `#${normalizeText(current.title)}`
      }
    })
    return current
  }

  // Process list to create sub-items
  if (node.type === 'list' && (node as ListNode).children) {
    current.items = (node as ListNode).children.map((child) =>
      extractTocItems(child, { title: '' }),
    )
    return current
  }

  // Process list items, treating the first child as the title
  if (node.type === 'listItem' && (node as ListItemNode).children) {
    const item = extractTocItems((node as ListItemNode).children[0], {
      title: '',
    })
    if ((node as ListItemNode).children.length > 1) {
      extractTocItems((node as ListItemNode).children[1], item)
    }
    return item
  }

  return current
}

/**
 * Remark plugin to generate a TOC
 */
const tocPlugin = () => (node: Root, file: VFile) => {
  // Generate a TOC based on the Markdown tree
  const table = toc(node as Root)

  if (!table.map) {
    // Empty return if there's no TOC
    file.data = { items: [] }
    return
  }

  // Extract items hierarchically
  const items = extractTocItems(table.map, { title: '' })
  file.data = { items: items.items }
}

export type TableOfContents = TocItems

/**
 * Generate a TOC (Table of Contents) from a Markdown string.
 * @param content - Markdown as a string
 * @returns Hierarchical structure of the Table of Contents
 */
export async function getTableOfContents(
  content: string,
): Promise<TableOfContents> {
  const result = await remark().use(tocPlugin).process(content)

  return result.data as TableOfContents
}
