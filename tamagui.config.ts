import { defaultConfig } from '@tamagui/config/v5'
import { createTamagui } from 'tamagui'

// v5 (not the v6 shown in the Tamagui Expo guide) so tokens and prop names match the reference
// app: $blue3, $borderColor, alignSelf, ... v6 is Tailwind-aligned and renames them.
export const tamaguiConfig = createTamagui({
  ...defaultConfig,
  settings: { ...defaultConfig.settings, onlyAllowShorthands: false },
})

export default tamaguiConfig

export type Conf = typeof tamaguiConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
