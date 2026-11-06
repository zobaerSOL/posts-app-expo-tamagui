import type { ReactNode } from 'react'
import { ScrollView, XStack, YStack } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { X } from '../icons'
import type { Tone } from '../hr/tokens'
import { IconBtn, IconTile, type IconComponent, T } from '../hr/ui'
import { useShell } from './shell-context'

// Panels rendered into the shell's layer host (see useShell().openLayer).

export function DrawerPanel({
  title,
  subtitle,
  children,
  footer,
}: { title: string; subtitle?: string; children: ReactNode; footer?: ReactNode }) {
  const { closeLayer } = useShell()
  const insets = useSafeAreaInsets()
  return (
    <YStack
      role="dialog"
      aria-modal
      aria-label={title}
      backgroundColor="surface"
      width="100%"
      maxWidth={480}
      height="94% md:100%"
      borderTopLeftRadius="6 md:0"
      borderTopRightRadius="6 md:0"
      borderLeftWidth={1}
      borderLeftColor="line"
      overflow="hidden"
    >
      <YStack
        display="flex md:none"
        alignSelf="center"
        width={40}
        height={4}
        borderRadius={4}
        marginTop={8}
        backgroundColor="lineStrong"
      />
      <XStack
        alignItems="flex-start"
        justifyContent="space-between"
        gap={12}
        paddingHorizontal={20}
        paddingVertical={18}
        borderBottomWidth={1}
        borderBottomColor="line"
      >
        <YStack
          flex={1}
          gap={2}
        >
          <T
            s={18}
            lh={26}
            w="600"
            role="heading"
            aria-level={3}
          >
            {title}
          </T>
          {subtitle ? (
            <T
              s={12}
              lh={16}
              c="muted"
            >
              {subtitle}
            </T>
          ) : null}
        </YStack>
        <IconBtn
          Icon={X}
          label="Close"
          size={32}
          onPress={closeLayer}
        />
      </XStack>
      <ScrollView
        flex={1}
        keyboardShouldPersistTaps="handled"
      >
        <YStack
          padding={20}
          gap={20}
        >
          {children}
        </YStack>
      </ScrollView>
      {footer ? (
        <XStack
          borderTopWidth={1}
          borderTopColor="line"
          paddingHorizontal={20}
          paddingTop={14}
          paddingBottom={14 + insets.bottom}
          gap={8}
          justifyContent="flex-end"
          flexWrap="wrap"
        >
          {footer}
        </XStack>
      ) : null}
    </YStack>
  )
}

export function ModalPanel({
  title,
  Icon,
  tone = 'blue',
  children,
  footer,
}: {
  title: string
  Icon?: IconComponent
  tone?: Tone
  children: ReactNode
  footer?: ReactNode
}) {
  const { closeLayer } = useShell()
  const insets = useSafeAreaInsets()
  return (
    <YStack
      role="dialog"
      aria-modal
      aria-label={title}
      backgroundColor="surface"
      width="100%"
      maxWidth={440}
      maxHeight="94%"
      borderTopLeftRadius="6"
      borderTopRightRadius="6"
      borderBottomLeftRadius="0 md:6"
      borderBottomRightRadius="0 md:6"
      overflow="hidden"
    >
      <XStack
        alignItems="flex-start"
        gap={14}
        paddingHorizontal={20}
        paddingTop={20}
      >
        {Icon ? (
          <IconTile
            Icon={Icon}
            tone={tone}
          />
        ) : null}
        <T
          flex={1}
          s={18}
          lh={26}
          w="600"
          role="heading"
          aria-level={3}
        >
          {title}
        </T>
        <IconBtn
          Icon={X}
          label="Close"
          size={32}
          onPress={closeLayer}
        />
      </XStack>
      <ScrollView keyboardShouldPersistTaps="handled">
        <YStack
          paddingHorizontal={20}
          paddingVertical={16}
          gap={16}
        >
          {children}
        </YStack>
      </ScrollView>
      {footer ? (
        <XStack
          paddingHorizontal={20}
          paddingTop={14}
          paddingBottom={20 + insets.bottom}
          gap={8}
          justifyContent="flex-end"
          flexWrap="wrap"
        >
          {footer}
        </XStack>
      ) : null}
    </YStack>
  )
}
