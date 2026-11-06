import { memo, type JSX } from 'react'
import { Svg, Path, type SvgProps } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const ClockAlert: (props: IconProps) => JSX.Element = themed(
  memo(function ClockAlert(props: IconProps) {
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
        <Path d="M12 6v6l4 2" stroke={color} />
        <Path d="M20 12v5" stroke={color} />
        <Path d="M20 21h.01" stroke={color} />
        <Path d="M21.25 8.2A10 10 0 1 0 16 21.16" stroke={color} />
      </Svg>
    )
  })
)
