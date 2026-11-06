import { memo, type JSX } from 'react'
import { Svg, Rect, type SvgProps } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const LayoutDashboard: (props: IconProps) => JSX.Element = themed(
  memo(function LayoutDashboard(props: IconProps) {
    const { color = 'black', size = 24, ...otherProps } = props as SvgProps & {
      color?: string
      size?: number
    }
    return (
      <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...otherProps}
      >
        <Rect width="7" height="9" x="3" y="3" rx="1" stroke={color} />
        <Rect width="7" height="5" x="14" y="3" rx="1" stroke={color} />
        <Rect width="7" height="9" x="14" y="12" rx="1" stroke={color} />
        <Rect width="7" height="5" x="3" y="16" rx="1" stroke={color} />
      </Svg>
    )
  })
)
