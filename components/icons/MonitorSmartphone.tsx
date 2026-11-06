import { memo, type JSX } from 'react'
import { Svg, Path, Rect, type SvgProps } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const MonitorSmartphone: (props: IconProps) => JSX.Element = themed(
  memo(function MonitorSmartphone(props: IconProps) {
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
        <Path d="M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8" stroke={color} />
        <Path d="M10 19v-3.96 3.15" stroke={color} />
        <Path d="M7 19h5" stroke={color} />
        <Rect width="6" height="10" x="16" y="12" rx="2" stroke={color} />
      </Svg>
    )
  })
)
