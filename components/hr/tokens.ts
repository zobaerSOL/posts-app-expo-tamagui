// SOL HR design tokens (docs/local/employee-home.html), added to Tamagui's light and dark themes
// so components can use them as bare theme keys (backgroundColor="surface") and dark mode follows
// the theme. Pure data: tamagui.config.ts imports this, so no React or React Native here.
// { ok: [fg, bg] } -> { okFg, okBg }, keeping the literal key names for the theme types.
function toneKeys<const T extends Record<string, readonly [fg: string, bg: string]>>(t: T) {
  return Object.fromEntries(
    Object.entries(t).flatMap(([name, [fg, bg]]) => [
      [`${name}Fg`, fg],
      [`${name}Bg`, bg],
    ])
  ) as { [K in keyof T & string as `${K}Fg` | `${K}Bg`]: string }
}

export const hrLight = {
  brand: '#2563EB',
  brandFill: '#2563EB',
  brandFillHover: '#1D4ED8',
  brandTint: '#EFF6FF',
  brandTint2: '#DBEAFE',
  brandInk: '#1E3A8A',
  teal: '#0D9488',
  canvas: '#F8FAFC',
  surface: '#FFFFFF',
  subtle: '#F1F5F9',
  line: '#E2E8F0',
  lineStrong: '#CBD5E1',
  ink: '#0F172A',
  ink2: '#334155',
  muted: '#64748B',
  onSolid: '#FFFFFF',
  scrim: 'rgba(15,23,42,0.40)',
  danger: '#DC2626',
  chart1: '#2563EB',
  chart2: '#0D9488',
  chart4: '#8B5CF6',
  ...toneKeys({
    ok: ['#15803D', '#F0FDF4'],
    warn: ['#B45309', '#FFFBEB'],
    danger: ['#B91C1C', '#FEF2F2'],
    info: ['#0369A1', '#F0F9FF'],
    blue: ['#1D4ED8', '#EFF6FF'],
    violet: ['#6D28D9', '#F5F3FF'],
    slate: ['#334155', '#F1F5F9'],
    teal: ['#0F766E', '#F0FDFA'],
  }),
}

export const hrDark: typeof hrLight = {
  brand: '#60A5FA',
  brandFill: '#3B82F6',
  brandFillHover: '#2563EB',
  brandTint: 'rgba(59,130,246,0.15)',
  brandTint2: 'rgba(59,130,246,0.25)',
  brandInk: '#BFDBFE',
  teal: '#2DD4BF',
  canvas: '#0B1220',
  surface: '#111A2E',
  subtle: '#18233A',
  line: '#26324A',
  lineStrong: '#3A4863',
  ink: '#E2E8F0',
  ink2: '#CBD5E1',
  muted: '#94A3B8',
  onSolid: '#FFFFFF',
  scrim: 'rgba(2,6,23,0.62)',
  danger: '#DC2626',
  chart1: '#60A5FA',
  chart2: '#2DD4BF',
  chart4: '#A78BFA',
  ...toneKeys({
    ok: ['#4ADE80', 'rgba(74,222,128,0.15)'],
    warn: ['#FBBF24', 'rgba(251,191,36,0.15)'],
    danger: ['#F87171', 'rgba(248,113,113,0.15)'],
    info: ['#38BDF8', 'rgba(56,189,248,0.15)'],
    blue: ['#60A5FA', 'rgba(96,165,250,0.15)'],
    violet: ['#A78BFA', 'rgba(167,139,250,0.15)'],
    slate: ['#CBD5E1', 'rgba(148,163,184,0.15)'],
    teal: ['#2DD4BF', 'rgba(45,212,191,0.15)'],
  }),
}

export type Tone = 'ok' | 'warn' | 'danger' | 'info' | 'blue' | 'violet' | 'slate' | 'teal'

// Typed lookups so a tone name resolves to theme keys without string casts at call sites.
export const toneFg = {
  ok: 'okFg',
  warn: 'warnFg',
  danger: 'dangerFg',
  info: 'infoFg',
  blue: 'blueFg',
  violet: 'violetFg',
  slate: 'slateFg',
  teal: 'tealFg',
} as const satisfies Record<Tone, keyof typeof hrLight>

export const toneBg = {
  ok: 'okBg',
  warn: 'warnBg',
  danger: 'dangerBg',
  info: 'infoBg',
  blue: 'blueBg',
  violet: 'violetBg',
  slate: 'slateBg',
  teal: 'tealBg',
} as const satisfies Record<Tone, keyof typeof hrLight>

export type ColorKey = keyof typeof hrLight
