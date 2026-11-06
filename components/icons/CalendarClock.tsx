import { memo, type JSX } from 'react'
import { Svg, Circle, Path, type SvgProps } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const CalendarClock: (props: IconProps) => JSX.Element = themed(
  memo(function CalendarClock(props: IconProps) {
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
        <Path d="M16 14v2.2l1.6 1" stroke={color} />
        <Path d="M16 2v3" stroke={color} />
        <Path d="M21 7.338V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h2.338" stroke={color} />
        <Path d="M3 9h5.859" stroke={color} />
        <Path d="M8 2v3" stroke={color} />
        <Circle cx="16" cy="16" r="6" stroke={color} />
      </Svg>
    )
  })
)
