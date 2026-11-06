import { memo, type JSX } from 'react'
import { Svg, Path, type SvgProps } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const CalendarPlus: (props: IconProps) => JSX.Element = themed(
  memo(function CalendarPlus(props: IconProps) {
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
        <Path d="M16 18h6" stroke={color} />
        <Path d="M16 2v3" stroke={color} />
        <Path d="M19 15v6" stroke={color} />
        <Path d="M21 11.5V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h8.3" stroke={color} />
        <Path d="M3 9h18" stroke={color} />
        <Path d="M8 2v3" stroke={color} />
      </Svg>
    )
  })
)
