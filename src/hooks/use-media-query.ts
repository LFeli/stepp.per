import * as React from 'react'

/**
 * Use hook that observer changes in media query
 * @param query The CSS media query to match.
 * @returns A boolean indicating whether the media query matches.
 */
export function useMediaQuery(query: string): boolean | undefined {
  const [isMatching, setIsMatching] = React.useState(false)

  React.useEffect(() => {
    // verify if environment support matchMedia method
    if (typeof window === 'undefined' || !window.matchMedia) {
      console.error('matchMedia is not supported in the current environment.')
      return
    }

    function onChange(event: MediaQueryListEvent) {
      setIsMatching(event.matches)
    }

    const mediaQueryList = window.matchMedia(query)
    mediaQueryList.addEventListener('change', onChange)

    return () => mediaQueryList.removeEventListener('change', onChange)
  }, [query])

  return isMatching
}
