import '../tamagui.generated.css'
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router'
import { ActivityIndicator, Platform, View } from 'react-native'
import { TamaguiProvider } from 'tamagui'
import { AppShell } from '../components/shell/app-shell'
import { ThemeScope, useThemeScheme } from '../components/theme'
import { tamaguiConfig } from '../tamagui.config'

const isWeb = Platform.OS === 'web'

// The shell paints the page background (the `canvas` theme key); screens must not cover it with
// the navigation theme's own background. The theme comes from expo-router, which bundles its own
// react-navigation: a ThemeProvider from @react-navigation/native does not reach its Stack.
const navLight = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: 'transparent' } }
const navDark = { ...DarkTheme, colors: { ...DarkTheme.colors, background: 'transparent' } }

// Shown while a route's loader data loads (native: always on first render). Expo Router renders
// this OUTSIDE the root layout's component tree, so it must not use Tamagui (no provider here).
export function SuspenseFallback() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  )
}

export default function RootLayout() {
  const theme = useThemeScheme()

  return (
    <TamaguiProvider
      config={tamaguiConfig}
      defaultTheme={theme.scheme}
    >
      <ThemeScope value={theme}>
        <ThemeProvider value={theme.scheme === 'dark' ? navDark : navLight}>
          <AppShell>
            {/* The shell supplies the header (top bar / sidebar); the stack renders bare screens */}
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: 'transparent' },
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="posts/index" />
              <Stack.Screen name="posts/[id]" />
              <Stack.Screen name="products/index" />
              <Stack.Screen name="products/[id]" />
              {/* Modal on native; a normal page on web */}
              <Stack.Screen
                name="user/[id]"
                options={{ presentation: isWeb ? 'card' : 'modal' }}
              />
            </Stack>
          </AppShell>
        </ThemeProvider>
      </ThemeScope>
    </TamaguiProvider>
  )
}
