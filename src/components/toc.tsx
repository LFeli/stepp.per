'use client'

import React from 'react'

import { useMounted } from '@/hooks/use-mounted'
import { TableOfContents } from '@/lib/toc'
import { cn } from '@/lib/utils'

interface TocProps {
  toc: TableOfContents
}

interface TreeProps {
  tree: TableOfContents
  level?: number
  activeItem?: string
}

function useActiveItem(itemIDs: string[]) {
  const [activeID, setActiveID] = React.useState<string | undefined>(undefined)

  React.useEffect(() => {
    if (!itemIDs.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting)
        if (visibleEntry) {
          setActiveID(visibleEntry.target.id)
        }
      },
      { rootMargin: '0% 0% -80% 0%' },
    )

    const observedElements = itemIDs
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element))

    observedElements.forEach((element) => observer.observe(element))

    return () => {
      observedElements.forEach((element) => observer.unobserve(element))
    }
  }, [itemIDs])

  return activeID
}

/**
 * Recursively renders a hierarchical TOC structure as nested lists
 */
function Tree({ tree, level = 1, activeItem }: TreeProps) {
  if (!tree.items?.length || level >= 3) {
    return null
  }

  return (
    <ul className={cn('m-0 list-none', { 'pl-4': level !== 1 })}>
      {tree.items.map((item, index) => (
        <li key={index} className={cn('mt-0 pt-2')}>
          <a
            href={item.url}
            className={cn(
              'inline-block no-underline transition-colors hover:text-foreground',
              item.url === `#${activeItem}`
                ? 'font-medium text-foreground'
                : 'text-muted-foreground',
            )}
          >
            {item.title}
          </a>

          {item.items?.length && (
            <Tree tree={item} level={level + 1} activeItem={activeItem} />
          )}
        </li>
      ))}
    </ul>
  )
}

export function PanelTableOfContents({ toc }: TocProps) {
  const itemIDs = React.useMemo(() => {
    if (!toc.items) {
      return []
    }

    return toc.items
      .flatMap((item) => [
        item.url,
        ...(item.items?.map((subItem) => subItem.url) || []),
      ])
      .filter(Boolean)
      .map((ID) => ID?.split('#')[1] || '')
  }, [toc])

  const mounted = useMounted()
  const activeHeading = useActiveItem(itemIDs)

  if (!mounted || !toc.items?.length) {
    return null
  }

  return (
    <div className="space-y-2">
      <p className="font-medium">On This Page</p>
      <Tree tree={toc} activeItem={activeHeading} />
    </div>
  )
}
