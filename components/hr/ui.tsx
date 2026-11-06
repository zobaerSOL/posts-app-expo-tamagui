import type { IconProps } from '@tamagui/helpers-icon'
import type { JSX, ReactNode } from 'react'
import { Platform } from 'react-native'
import { Text, type TextProps, XStack, type XStackProps, YStack, type YStackProps } from 'tamagui'
import { type ColorKey, type Tone, toneBg, toneFg } from './tokens'

export type IconComponent = (props: IconProps) => JSX.Element

// Text with the design's type scale: explicit size and line height, colour by theme key.
// A numeric line height is a multiplier of the font size in Tamagui's `lineHeight` prop, and on
// native also in `style` (a pixel value there gives lineHeight x fontSize, so 24 on a 16px font
// is 384px and the text vanishes). So native gets the multiplier (lh / s) through the prop. On web
// a bare number in an inline style is unitless, so web gets an explicit px through `style`.
export function T({
  c = 'ink',
  s = 14,
  lh,
  w,
  style,
  ...rest
}: Omit<TextProps, 'color' | 'fontSize' | 'lineHeight' | 'fontWeight'> & {
  c?: ColorKey
  s?: number
  lh?: number
  w?: '400' | '500' | '600' | '700'
}) {
  const lineHeight = lh ?? Math.round(s * 1.43)
  return (
    <Text
      color={c}
      fontSize={s}
      fontWeight={w}
      {...(Platform.OS === 'web' ? {} : { lineHeight: lineHeight / s })}
      style={[Platform.OS === 'web' ? { lineHeight: `${lineHeight}px` as never } : null, style]}
      {...rest}
    />
  )
}

export function Overline({ children }: { children: ReactNode }) {
  return (
    <T
      s={11}
      lh={16}
      w="600"
      c="muted"
      textTransform="uppercase"
      letterSpacing={0.44}
    >
      {children}
    </T>
  )
}

export function Card(props: YStackProps) {
  return (
    <YStack
      backgroundColor="surface"
      borderWidth={1}
      borderColor="line"
      borderRadius={10}
      minWidth={0}
      flexGrow={1}
      {...props}
    />
  )
}

export function CardHead({ title, right }: { title: string; right?: ReactNode }) {
  return (
    <XStack
      alignItems="center"
      justifyContent="space-between"
      gap={12}
      paddingHorizontal={20}
      paddingTop={16}
    >
      <T
        s={16}
        lh={24}
        w="600"
        role="heading"
        aria-level={3}
      >
        {title}
      </T>
      {right}
    </XStack>
  )
}

export function CardBody(props: YStackProps) {
  return (
    <YStack
      paddingHorizontal={20}
      paddingTop={16}
      paddingBottom={20}
      {...props}
    />
  )
}

export function CardFoot({ children }: { children: ReactNode }) {
  return (
    <XStack
      borderTopWidth={1}
      borderTopColor="line"
      paddingHorizontal={20}
      paddingVertical={12}
      alignItems="center"
      justifyContent="space-between"
      gap={12}
      flexWrap="wrap"
    >
      {children}
    </XStack>
  )
}

export function Chip({ tone, Icon, label }: { tone: Tone; Icon?: IconComponent; label: string }) {
  return (
    <XStack
      alignItems="center"
      gap={6}
      height={24}
      paddingLeft={Icon ? 8 : 10}
      paddingRight={10}
      borderRadius={999}
      backgroundColor={toneBg[tone]}
      alignSelf="flex-start"
    >
      {Icon ? (
        <Icon
          size={14}
          color={toneFg[tone]}
        />
      ) : null}
      <T
        s={12}
        lh={16}
        w="500"
        c={toneFg[tone]}
      >
        {label}
      </T>
    </XStack>
  )
}

// Rounded square holding an icon. Without a tone it uses the primary tint.
export function IconTile({
  Icon,
  tone,
  size = 36,
  iconSize = 20,
}: { Icon: IconComponent; tone?: Tone; size?: number; iconSize?: number }) {
  const bg = tone ? toneBg[tone] : 'brandTint'
  const fg = tone ? toneFg[tone] : 'brand'
  return (
    <YStack
      width={size}
      height={size}
      borderRadius={8}
      alignItems="center"
      justifyContent="center"
      backgroundColor={bg}
    >
      <Icon
        size={iconSize}
        color={fg}
      />
    </YStack>
  )
}

const AV_COLORS = [
  '#2563EB',
  '#0F766E',
  '#7C3AED',
  '#BE185D',
  '#C2410C',
  '#0E7490',
  '#4338CA',
  '#15803D',
  '#B45309',
  '#475569',
]

function avatarColor(name: string) {
  let h = 0
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return AV_COLORS[h % AV_COLORS.length]
}

export function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export function Avatar({ name, size = 28 }: { name: string; size?: number }) {
  return (
    <YStack
      width={size}
      height={size}
      borderRadius={size / 2}
      alignItems="center"
      justifyContent="center"
      style={{ backgroundColor: avatarColor(name) }}
    >
      <T
        s={Math.round(size * 0.38)}
        lh={Math.round(size * 0.5)}
        w="600"
        c="onSolid"
      >
        {initials(name)}
      </T>
    </YStack>
  )
}

type BtnProps = Omit<XStackProps, 'children'> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  Icon?: IconComponent
  children?: ReactNode
  disabled?: boolean
}

const HEIGHT = { sm: 32, md: 40, lg: 48 } as const
const FONT = { sm: 13, md: 14, lg: 16 } as const

export function Btn({
  variant = 'secondary',
  size = 'md',
  Icon,
  children,
  disabled,
  onPress,
  ...rest
}: BtnProps) {
  const fg = variant === 'primary' ? 'onSolid' : variant === 'ghost' ? 'ink2' : 'ink'
  const bg =
    variant === 'primary' ? 'brandFill' : variant === 'secondary' ? 'surface' : 'transparent'
  const hover = variant === 'primary' ? 'brandFillHover' : 'subtle'
  return (
    <XStack
      render="button"
      role="button"
      aria-disabled={disabled}
      onPress={disabled ? undefined : onPress}
      height={HEIGHT[size]}
      paddingHorizontal={children ? (size === 'sm' ? 12 : size === 'lg' ? 20 : 16) : 0}
      width={children ? undefined : HEIGHT[size]}
      alignItems="center"
      justifyContent="center"
      gap={8}
      borderRadius={6}
      borderWidth={1}
      borderColor={variant === 'secondary' ? 'lineStrong' : 'transparent'}
      backgroundColor={disabled ? bg : `${bg} hover:${hover} press:${hover}`}
      opacity={disabled ? 0.45 : 1}
      cursor={disabled ? 'not-allowed' : 'pointer'}
      {...rest}
    >
      {Icon ? (
        <Icon
          size={size === 'lg' ? 20 : size === 'sm' ? 16 : 18}
          color={fg}
        />
      ) : null}
      {children ? (
        <T
          s={FONT[size]}
          lh={20}
          w="600"
          c={fg}
          numberOfLines={1}
        >
          {children}
        </T>
      ) : null}
    </XStack>
  )
}

export function Hr() {
  return (
    <YStack
      height={1}
      backgroundColor="line"
    />
  )
}

export function Field({
  label,
  required,
  help,
  error,
  children,
}: {
  label: string
  required?: boolean
  help?: string
  error?: string
  children: ReactNode
}): JSX.Element {
  return (
    <YStack gap={6}>
      <T
        s={13}
        lh={20}
        w="500"
        c="ink2"
      >
        {label}
        {required ? <T c="dangerFg"> *</T> : null}
      </T>
      {children}
      {help && !error ? (
        <T
          s={12}
          lh={16}
          c="muted"
        >
          {help}
        </T>
      ) : null}
      {error ? (
        <T
          s={12}
          lh={16}
          c="dangerFg"
          role="alert"
        >
          {error}
        </T>
      ) : null}
    </YStack>
  )
}

// Segmented control (pill group), e.g. notification filters or which punch is missing.
export function Seg<V extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: readonly V[]
  value: V
  onChange: (v: V) => void
  label: string
}) {
  return (
    <XStack
      role="group"
      aria-label={label}
      alignSelf="flex-start"
      flexWrap="wrap"
      backgroundColor="subtle"
      borderWidth={1}
      borderColor="line"
      borderRadius={8}
      padding={3}
      gap={2}
    >
      {options.map((o) => {
        const on = o === value
        return (
          <XStack
            key={o}
            render="button"
            role="button"
            aria-pressed={on}
            onPress={() => onChange(o)}
            borderWidth={0}
            height={30}
            paddingHorizontal={12}
            alignItems="center"
            borderRadius={6}
            cursor="pointer"
            backgroundColor={on ? 'surface' : 'transparent'}
          >
            <T
              s={13}
              lh={20}
              w={on ? '600' : '500'}
              c={on ? 'ink' : 'ink2'}
            >
              {o}
            </T>
          </XStack>
        )
      })}
    </XStack>
  )
}

// Icon-only button with an optional count badge (top bar actions).
export function IconBtn({
  Icon,
  label,
  onPress,
  badge,
  size = 40,
}: {
  Icon: IconComponent
  label: string
  onPress?: () => void
  badge?: number
  size?: number
}) {
  return (
    <YStack
      position="relative"
      width={size}
      height={size}
    >
      <XStack
        render="button"
        role="button"
        aria-label={label}
        onPress={onPress}
        borderWidth={0}
        width={size}
        height={size}
        alignItems="center"
        justifyContent="center"
        borderRadius={6}
        cursor="pointer"
        backgroundColor="transparent hover:subtle press:subtle"
      >
        <Icon
          size={20}
          color="ink2"
        />
      </XStack>
      {badge ? (
        <YStack
          position="absolute"
          top={6}
          right={6}
          minWidth={16}
          height={16}
          paddingHorizontal={4}
          borderRadius={999}
          backgroundColor="danger"
          borderWidth={2}
          borderColor="surface"
          alignItems="center"
          justifyContent="center"
          pointerEvents="none"
        >
          <T
            s={10}
            lh={12}
            w="600"
            c="onSolid"
          >
            {badge}
          </T>
        </YStack>
      ) : null}
    </YStack>
  )
}
