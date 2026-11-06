import { useEffect, useState } from 'react'

// Wall-clock time, ticking every second. null until mounted so the server render and the first
// client render match (the server's clock is not the user's).
export function useNow(): number | null {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}
