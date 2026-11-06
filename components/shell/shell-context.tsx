import { createContext, type ReactNode, useContext } from 'react'
import type { Tone } from '../hr/tokens'
import type { Notification } from './session'

export type ToastInput = {
  tone?: Tone
  title: string
  body?: string
  action?: { label: string; onPress: () => void }
}

export type ShellApi = {
  toast: (t: ToastInput) => void
  // 'drawer' is a right-hand panel on wide screens and a bottom sheet on phones; 'modal' is a
  // centered dialog on wide screens and a bottom sheet on phones.
  openLayer: (kind: 'drawer' | 'modal', node: ReactNode) => void
  closeLayer: () => void
  notifications: Notification[]
  markAllRead: () => void
}

export const ShellContext = createContext<ShellApi | null>(null)

export function useShell(): ShellApi {
  const value = useContext(ShellContext)
  if (!value) throw new Error('useShell must be used inside <AppShell>')
  return value
}

// Toast for nav items and buttons whose screens the pilot does not implement.
export function useNotBuilt() {
  const { toast } = useShell()
  return (label: string) =>
    toast({
      tone: 'info',
      title: `${label} isn’t built yet`,
      body: 'This pilot only implements Home plus the Demo APIs screens.',
    })
}
