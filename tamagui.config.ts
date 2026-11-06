import { defaultConfig } from '@tamagui/config/v5'
import { createTamagui } from 'tamagui'
import { hrDark, hrLight } from './components/hr/tokens'

// v5 (not the v6 shown in the Tamagui Expo guide) so tokens and prop names match the reference
// app: $blue3, $borderColor, alignSelf, ... v6 is Tailwind-aligned and renames them.
export const tamaguiConfig = createTamagui({
  ...defaultConfig,
  settings: { ...defaultConfig.settings, onlyAllowShorthands: false },
  // HR palette (components/hr/tokens.ts) layered onto the base light and dark themes.
  themes: {
    ...defaultConfig.themes,
    light: { ...defaultConfig.themes.light, ...hrLight },
    dark: { ...defaultConfig.themes.dark, ...hrDark },
  },
})

export default tamaguiConfig

export type Conf = typeof tamaguiConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
