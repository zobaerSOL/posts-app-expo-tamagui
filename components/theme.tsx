import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { Platform, useColorScheme } from 'react-native'
import { Button } from 'tamagui'

type Scheme = 'light' | 'dark'
type ThemeContextValue = { scheme: Scheme; toggle: () => void }

const ThemeContext = createContext<ThemeContextValue>({ scheme: 'light', toggle: () => {} })

// Follows the OS scheme until the user toggles; not persisted (pilot).
// On web the server cannot know the OS scheme and renders 'light', so the first client render must
// also be 'light' to hydrate cleanly; the real scheme is applied after mount (dark users see a
// brief light flash).
export function useThemeScheme(): ThemeContextValue & { Provider: typeof ThemeContext.Provider } {
  const osScheme = useColorScheme() === 'dark' ? 'dark' : 'light'
  const [mounted, setMounted] = useState(Platform.OS !== 'web')
  useEffect(() => setMounted(true), [])
  const system = mounted ? osScheme : 'light'
  const [override, setOverride] = useState<Scheme>()
  const scheme = override ?? system
  return useMemo(
    () => ({
      scheme,
      toggle: () => setOverride(scheme === 'dark' ? 'light' : 'dark'),
      Provider: ThemeContext.Provider,
    }),
    [scheme]
  )
}

export function ThemeScope({ value, children }: { value: ThemeContextValue; children: ReactNode }) {
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function SwitchThemeButton() {
  const { scheme, toggle } = useContext(ThemeContext)
  return <Button onPress={toggle}>Theme: {scheme}</Button>
}
