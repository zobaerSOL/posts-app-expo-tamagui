import { memo, type JSX } from 'react'
import { Svg, Path, type SvgProps } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const CalendarOff: (props: IconProps) => JSX.Element = themed(
  memo(function CalendarOff(props: IconProps) {
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
        <Path d="M16 2v3" stroke={color} />
        <Path d="m2 2 20 20" stroke={color} />
        <Path d="M21 9h-5.5" stroke={color} />
        <Path d="M3 9h6" stroke={color} />
        <Path d="M3.586 3.586A2 2 0 003 5v14a2 2 0 002 2h14a2 2 0 001.414-.586" stroke={color} />
        <Path d="M8.656 3H19a2 2 0 012 2v10.344" stroke={color} />
      </Svg>
    )
  })
)
