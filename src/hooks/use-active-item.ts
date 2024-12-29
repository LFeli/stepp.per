import * as React from 'react'

/**
 * Use hook that track which HTML elements are visible in the viewport.
 * @param itemIDs list of string representing the ID's of the HTML element to track.
 * @returns The `ID` of the visible element, or `undefined`if none are
 */
export function useActiveItem(itemIDs: string[]) {
  const [activeID, setActiveID] = React.useState<string | undefined>(undefined)

  React.useEffect(() => {
    if (!itemIDs.length) {
      return
    }

    // create observer for detected when element enter or leave the visible area.
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting)

        if (visibleEntry) {
          setActiveID(visibleEntry.target.id)
        }
      },
      { rootMargin: '0% 0% -80% 0%' },
    )

    // get DOM elements corresponding to the given ID's
    const observedElements = itemIDs
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element))

    observedElements.forEach((element) => observer.observe(element))

    // removes observers to avoid memory leaks.
    return () => {
      observedElements.forEach((element) => observer.unobserve(element))
    }
  }, [itemIDs])

  return activeID
}
