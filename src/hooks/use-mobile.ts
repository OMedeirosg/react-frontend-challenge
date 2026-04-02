import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    const w = globalThis.window
    return w !== undefined && w.innerWidth < MOBILE_BREAKPOINT
  })

  React.useEffect(() => {
    const w = globalThis.window
    const mql = w.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(w.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener('change', onChange)
    onChange()
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return isMobile
}
