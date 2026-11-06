import { useState } from 'react'
import { XStack, YStack } from 'tamagui'
import { Check, CircleCheck, FileDown, Hourglass, Lock, Megaphone } from '../icons'
import { Btn, type IconComponent, IconTile, Seg, T } from '../hr/ui'
import { DrawerPanel } from './panels'
import type { Notification, NotificationCategory } from './session'
import { useShell } from './shell-context'

const ICONS: Record<Notification['icon'], IconComponent> = {
  'circle-check': CircleCheck,
  hourglass: Hourglass,
  megaphone: Megaphone,
  lock: Lock,
  'file-down': FileDown,
}

const TABS = ['All', 'Approvals', 'Payroll', 'General'] as const

export function NotificationsPanel() {
  const { notifications, markAllRead } = useShell()
  const [tab, setTab] = useState<(typeof TABS)[number]>('All')
  const unread = notifications.filter((n) => n.unread).length
  const shown = notifications.filter(
    (n) => tab === 'All' || n.category === (tab as NotificationCategory)
  )

  return (
    <DrawerPanel
      title="Notifications"
      subtitle={`${unread} unread · salary figures never appear in notifications`}
      footer={
        <Btn
          Icon={Check}
          onPress={markAllRead}
        >
          Mark all as read
        </Btn>
      }
    >
      <Seg
        label="Filter"
        options={TABS}
        value={tab}
        onChange={setTab}
      />
      <YStack marginHorizontal={-8}>
        {shown.length === 0 ? (
          <YStack
            alignItems="center"
            gap={8}
            padding={32}
          >
            <T
              s={16}
              lh={24}
              w="600"
            >
              Nothing here
            </T>
            <T c="muted">You’re up to date in this category.</T>
          </YStack>
        ) : (
          shown.map((n) => (
            <XStack
              key={n.id}
              gap={12}
              padding={12}
              borderRadius={8}
            >
              <IconTile
                Icon={ICONS[n.icon]}
                tone={n.tone}
                iconSize={18}
              />
              <YStack
                flex={1}
                gap={2}
                minWidth={0}
              >
                <T w="600">{n.title}</T>
                <T c="ink2">{n.body}</T>
                <T
                  s={12}
                  lh={16}
                  c="muted"
                >
                  {n.time}
                </T>
              </YStack>
              {n.unread ? (
                <YStack
                  width={8}
                  height={8}
                  borderRadius={4}
                  marginTop={6}
                  backgroundColor="brandFill"
                />
              ) : null}
            </XStack>
          ))
        )}
      </YStack>
    </DrawerPanel>
  )
}
