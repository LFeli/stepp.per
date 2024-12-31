'use client'

import React from 'react'

interface UseCopyToClipboardProps {
  timeout?: number
  onCopy?: () => void
}

export function useCopyToClipboard({
  timeout = 2000,
  onCopy,
}: UseCopyToClipboardProps) {
  const [isCopied, setIsCopied] = React.useState(false)

  /**
   *  Function that copy value to user clipboard, and with custom settings `timeout` and `onCopy` action for using in anyway case.
   * @param valueToCopy literally is a value that to copy to clipboard
   * @returns
   */
  async function copyToClipboard(valueToCopy: string) {
    if (typeof window === 'undefined' || !navigator.clipboard.writeText) {
      return
    }

    if (!valueToCopy) {
      return
    }

    try {
      await navigator.clipboard.writeText(valueToCopy)
      setIsCopied(true)

      if (onCopy) {
        onCopy()
      }

      setTimeout(() => setIsCopied(false), timeout)
    } catch (error) {
      console.error(error)
    }
  }

  return { isCopied, copyToClipboard }
}
