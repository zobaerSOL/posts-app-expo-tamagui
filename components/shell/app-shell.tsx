import { Link, usePathname } from 'expo-router'
import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Svg, { Path, Rect } from 'react-native-svg'
import { ScrollView, XStack, type XStackProps, YStack } from 'tamagui'
import { Bell, ChevronDown, Ellipsis, Menu, Moon, Sun, X } from '../icons'
import { toneBg, toneFg } from '../hr/tokens'
import { Avatar, IconBtn, T } from '../hr/ui'
import { useThemeContext } from '../theme'
import { NAV, type NavItem, routeMeta, TABS } from './nav'
import { NotificationsPanel } from './notifications-panel'
import { sampleNotifications, session } from './session'
import { ShellContext, type ShellApi, type ToastInput, useNotBuilt } from './shell-context'

// Anchors underline their text on web, and the underline reaches flex children.
const NO_UNDERLINE = Platform.select({ web: { textDecorationLine: 'none' as const } })

type Layer = { kind: 'drawer' | 'modal'; node: ReactNode }
type ToastItem = ToastInput & { id: number }

let nextToastId = 1

// The HR portal frame: sidebar on wide screens (a drawer below 1024px), top bar, bottom tabs on
// phones, plus the host for toasts and overlay panels. Wraps the router's Stack.
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const insets = useSafeAreaInsets()
  const { scheme, toggle } = useThemeContext()
  const [navOpen, setNavOpen] = useState(false)
  const [layer, setLayer] = useState<Layer | null>(null)
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [notifications, setNotifications] = useState(sampleNotifications)

  const closeLayer = useCallback(() => setLayer(null), [])
  const dismissToast = useCallback(
    (id: number) => setToasts((all) => all.filter((t) => t.id !== id)),
    []
  )

  const api = useMemo<ShellApi>(
    () => ({
      toast: (input) => {
        const id = nextToastId++
        setToasts((all) => [...all, { ...input, id }])
        setTimeout(() => dismissToast(id), input.action ? 9000 : 5000)
      },
      openLayer: (kind, node) => setLayer({ kind, node }),
      closeLayer,
      notifications,
      markAllRead: () => {
        setNotifications((all) => all.map((n) => ({ ...n, unread: false })))
        setLayer(null)
        api.toast({ title: 'All notifications marked as read' })
      },
    }),
    [notifications, closeLayer, dismissToast]
  )

  // The drawer closes whenever the route changes.
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname is the trigger
  useEffect(() => setNavOpen(false), [pathname])

  useEffect(() => {
    if (Platform.OS !== 'web') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (layer) setLayer(null)
      else setNavOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [layer])

  const unread = notifications.filter((n) => n.unread).length

  return (
    <ShellContext.Provider value={api}>
      <YStack
        position="relative"
        flex={1}
        backgroundColor="canvas"
      >
        <XStack
          flex={1}
          minHeight={0}
        >
          <YStack
            display="none lg:flex"
            width={264}
            backgroundColor="surface"
            borderRightWidth={1}
            borderRightColor="line"
            paddingTop={insets.top}
          >
            <SidebarContent pathname={pathname} />
          </YStack>

          <YStack
            position="relative"
            flex={1}
            minWidth={0}
          >
            <Topbar
              pathname={pathname}
              unread={unread}
              dark={scheme === 'dark'}
              onToggleTheme={toggle}
              onOpenMenu={() => setNavOpen(true)}
              onOpenNotifications={() => setLayer({ kind: 'drawer', node: <NotificationsPanel /> })}
            />
            <YStack
              flex={1}
              minHeight={0}
            >
              {children}
            </YStack>
            <BottomNav
              pathname={pathname}
              onMore={() => setNavOpen(true)}
            />
            <Toasts
              items={toasts}
              onDismiss={dismissToast}
            />
          </YStack>
        </XStack>

        {navOpen ? (
          <YStack
            display="flex lg:none"
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            zIndex={80}
          >
            <Scrim onPress={() => setNavOpen(false)} />
            <YStack
              position="relative"
              width={300}
              maxWidth="86%"
              height="100%"
              backgroundColor="surface"
              paddingTop={insets.top}
              style={{ boxShadow: '0 8px 24px 0 rgba(15,23,42,0.12)' }}
            >
              <SidebarContent
                pathname={pathname}
                onNavigate={() => setNavOpen(false)}
                onClose={() => setNavOpen(false)}
              />
            </YStack>
          </YStack>
        ) : null}

        {layer ? (
          <YStack
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            zIndex={90}
          >
            <Scrim onPress={closeLayer} />
            {layer.kind === 'drawer' ? (
              <XStack
                position="relative"
                flex={1}
                justifyContent="flex-end"
                alignItems="flex-end md:stretch"
                pointerEvents="box-none"
              >
                {layer.node}
              </XStack>
            ) : (
              <YStack
                position="relative"
                flex={1}
                justifyContent="flex-end md:center"
                alignItems="center"
                padding="0 md:5"
                pointerEvents="box-none"
              >
                {layer.node}
              </YStack>
            )}
          </YStack>
        ) : null}
      </YStack>
    </ShellContext.Provider>
  )
}

function Scrim({ onPress }: { onPress: () => void }) {
  return (
    <YStack
      role="button"
      aria-label="Close"
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      backgroundColor="scrim"
      onPress={onPress}
    />
  )
}

function Logo({ size = 32 }: { size?: number }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
    >
      <Rect
        width={32}
        height={32}
        rx={8}
        fill="#E31E24"
      />
      <Path
        d="M9 23C9 14.5 14.5 9 23 9c0 8.5-5.5 14-14 14Z"
        fill="#fff"
      />
      <Path
        d="M10.5 21.5 18 14"
        stroke="#E31E24"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  )
}

function NavRow({ item, active, ...rest }: { item: NavItem; active: boolean } & XStackProps) {
  return (
    <XStack
      position="relative"
      alignItems="center"
      gap={12}
      height={38}
      paddingHorizontal={10}
      borderRadius={6}
      cursor="pointer"
      backgroundColor={active ? 'brandTint' : 'transparent hover:subtle press:subtle'}
      {...rest}
      style={NO_UNDERLINE}
    >
      {active ? (
        <YStack
          position="absolute"
          left={-12}
          top={7}
          bottom={7}
          width={3}
          borderTopRightRadius={3}
          borderBottomRightRadius={3}
          backgroundColor="brandFill"
        />
      ) : null}
      <item.Icon
        size={20}
        color={active ? 'brand' : 'muted'}
      />
      <T
        w="500"
        c={active ? 'brandInk' : 'ink2'}
        numberOfLines={1}
      >
        {item.label}
      </T>
    </XStack>
  )
}

// Menu links replace the current screen instead of pushing, so switching sections does not stack
// copies of the same screen under each other.
function SidebarContent({
  pathname,
  onNavigate,
  onClose,
}: { pathname: string; onNavigate?: () => void; onClose?: () => void }) {
  const [closed, setClosed] = useState<Set<string>>(new Set())
  const notBuilt = useNotBuilt()

  return (
    <YStack
      flex={1}
      minHeight={0}
      aria-label="Main navigation"
      role="navigation"
    >
      <XStack
        height={64}
        alignItems="center"
        gap={10}
        paddingHorizontal={18}
        borderBottomWidth={1}
        borderBottomColor="line"
      >
        <Logo />
        <YStack
          flex={1}
          minWidth={0}
        >
          <T
            w="700"
            lh={16}
            numberOfLines={1}
          >
            SOL HR Portal
          </T>
          <T
            s={11}
            lh={16}
            c="muted"
            numberOfLines={1}
          >
            {session.company}
          </T>
        </YStack>
        {onClose ? (
          <IconBtn
            Icon={X}
            label="Close menu"
            size={32}
            onPress={onClose}
          />
        ) : null}
      </XStack>
      <ScrollView flex={1}>
        <YStack
          paddingHorizontal={12}
          paddingTop={12}
          paddingBottom={16}
          gap={8}
        >
          {NAV.map((group) => {
            const isClosed = closed.has(group.label)
            return (
              <YStack key={group.label}>
                <XStack
                  role="button"
                  aria-expanded={!isClosed}
                  onPress={() =>
                    setClosed((s) => {
                      const next = new Set(s)
                      next.has(group.label) ? next.delete(group.label) : next.add(group.label)
                      return next
                    })
                  }
                  alignItems="center"
                  justifyContent="space-between"
                  paddingHorizontal={10}
                  paddingTop={10}
                  paddingBottom={6}
                  cursor="pointer"
                >
                  <T
                    s={11}
                    lh={16}
                    w="600"
                    c="muted"
                    textTransform="uppercase"
                    letterSpacing={0.44}
                  >
                    {group.label}
                  </T>
                  <ChevronDown
                    size={14}
                    color="muted"
                    style={{ transform: [{ rotate: isClosed ? '-90deg' : '0deg' }] }}
                  />
                </XStack>
                {isClosed
                  ? null
                  : group.items.map((item) => {
                      const active = !!item.href && !!item.isActive?.(pathname)
                      return item.href ? (
                        <Link
                          key={item.label}
                          href={item.href}
                          asChild
                          replace
                          onPress={onNavigate}
                        >
                          <NavRow
                            item={item}
                            active={active}
                            render="a"
                            aria-current={active ? 'page' : undefined}
                          />
                        </Link>
                      ) : (
                        <NavRow
                          key={item.label}
                          item={item}
                          active={false}
                          role="button"
                          onPress={() => notBuilt(item.label)}
                        />
                      )
                    })}
              </YStack>
            )
          })}
        </YStack>
      </ScrollView>
    </YStack>
  )
}

function Topbar({
  pathname,
  unread,
  dark,
  onToggleTheme,
  onOpenMenu,
  onOpenNotifications,
}: {
  pathname: string
  unread: number
  dark: boolean
  onToggleTheme: () => void
  onOpenMenu: () => void
  onOpenNotifications: () => void
}) {
  const insets = useSafeAreaInsets()
  const { title, crumbs } = routeMeta(pathname)

  return (
    <YStack
      backgroundColor="surface"
      borderBottomWidth={1}
      borderBottomColor="line"
      paddingTop={insets.top}
    >
      <XStack
        height="5 md:6"
        alignItems="center"
        gap={8}
        paddingHorizontal="2 md:4 lg:5"
      >
        <YStack display="flex lg:none">
          <IconBtn
            Icon={Menu}
            label="Open menu"
            onPress={onOpenMenu}
          />
        </YStack>
        <YStack
          flex={1}
          minWidth={0}
        >
          {crumbs.length ? (
            <T
              display="none md:flex"
              s={12}
              lh={16}
              c="muted"
              numberOfLines={1}
            >
              {crumbs.join('  ›  ')}
            </T>
          ) : null}
          <T
            s={16}
            lh={24}
            w="600"
            numberOfLines={1}
          >
            {title}
          </T>
        </YStack>
        <IconBtn
          Icon={dark ? Sun : Moon}
          label={`Switch to ${dark ? 'light' : 'dark'} mode`}
          onPress={onToggleTheme}
        />
        <IconBtn
          Icon={Bell}
          label={`Notifications, ${unread} unread`}
          badge={unread}
          onPress={onOpenNotifications}
        />
        <XStack
          alignItems="center"
          gap={10}
          paddingHorizontal={6}
        >
          <Avatar
            name={session.name}
            size={28}
          />
          <YStack display="none xl:flex">
            <T
              s={13}
              lh={16}
              w="600"
            >
              {session.name}
            </T>
            <T
              s={12}
              lh={16}
              c="muted"
            >
              {session.role}
            </T>
          </YStack>
        </XStack>
      </XStack>
    </YStack>
  )
}

function BottomNav({ pathname, onMore }: { pathname: string; onMore: () => void }) {
  const insets = useSafeAreaInsets()
  const notBuilt = useNotBuilt()

  const tab = (item: NavItem, active: boolean) => (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      gap={3}
      cursor="pointer"
    >
      <item.Icon
        size={22}
        color={active ? 'brand' : 'muted'}
      />
      <T
        s={11}
        lh={14}
        w="500"
        c={active ? 'brand' : 'muted'}
      >
        {item.label}
      </T>
    </YStack>
  )

  return (
    <XStack
      display="flex md:none"
      role="navigation"
      aria-label="Primary"
      height={64 + insets.bottom}
      paddingBottom={insets.bottom}
      backgroundColor="surface"
      borderTopWidth={1}
      borderTopColor="line"
    >
      {TABS.map((item) => {
        const active = !!item.href && !!item.isActive?.(pathname)
        return item.href ? (
          <Link
            key={item.label}
            href={item.href}
            asChild
            replace
          >
            <XStack
              flex={1}
              render="a"
              aria-current={active ? 'page' : undefined}
              style={NO_UNDERLINE}
            >
              {tab(item, active)}
            </XStack>
          </Link>
        ) : (
          <XStack
            key={item.label}
            flex={1}
            role="button"
            onPress={() => notBuilt(item.label)}
          >
            {tab(item, false)}
          </XStack>
        )
      })}
      <XStack
        flex={1}
        role="button"
        aria-label="More"
        onPress={onMore}
      >
        {tab({ label: 'More', Icon: Ellipsis }, false)}
      </XStack>
    </XStack>
  )
}

function Toasts({ items, onDismiss }: { items: ToastItem[]; onDismiss: (id: number) => void }) {
  if (!items.length) return null
  return (
    <YStack
      position="absolute"
      right={16}
      bottom={16}
      left={16}
      alignItems="flex-end"
      gap={8}
      zIndex={100}
      pointerEvents="box-none"
    >
      {items.map((t) => {
        const tone = t.tone ?? 'ok'
        return (
          <XStack
            key={t.id}
            role="status"
            width="100%"
            maxWidth={380}
            gap={12}
            paddingVertical={12}
            paddingLeft={14}
            paddingRight={8}
            alignItems="flex-start"
            backgroundColor="surface"
            borderWidth={1}
            borderColor="line"
            borderRadius={10}
            style={{ boxShadow: '0 8px 24px 0 rgba(15,23,42,0.12)' }}
          >
            <YStack
              marginTop={2}
              width={20}
              height={20}
              borderRadius={10}
              backgroundColor={toneBg[tone]}
              alignItems="center"
              justifyContent="center"
            >
              <YStack
                width={8}
                height={8}
                borderRadius={4}
                backgroundColor={toneFg[tone]}
              />
            </YStack>
            <YStack
              flex={1}
              minWidth={0}
              gap={2}
            >
              <T w="600">{t.title}</T>
              {t.body ? (
                <T
                  s={13}
                  lh={20}
                  c="ink2"
                >
                  {t.body}
                </T>
              ) : null}
              {t.action ? (
                <T
                  marginTop={6}
                  w="600"
                  c="brand"
                  cursor="pointer"
                  role="button"
                  onPress={() => {
                    t.action?.onPress()
                    onDismiss(t.id)
                  }}
                >
                  {t.action.label}
                </T>
              ) : null}
            </YStack>
            <IconBtn
              Icon={X}
              label="Dismiss"
              size={32}
              onPress={() => onDismiss(t.id)}
            />
          </XStack>
        )
      })}
    </YStack>
  )
}
