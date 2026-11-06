import '../tamagui.generated.css'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { ActivityIndicator, Platform, View } from 'react-native'
import { TamaguiProvider, YStack } from 'tamagui'
import { SiteHeader } from '../components/site-header'
import { ThemeScope, useThemeScheme } from '../components/theme'
import { tamaguiConfig } from '../tamagui.config'

const isWeb = Platform.OS === 'web'

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
        <ThemeProvider value={theme.scheme === 'dark' ? DarkTheme : DefaultTheme}>
          <YStack
            flex={1}
            backgroundColor="background"
          >
            {isWeb && <SiteHeader />}
            <Stack screenOptions={{ headerShown: !isWeb }}>
              <Stack.Screen
                name="index"
                options={{ title: 'Home' }}
              />
              <Stack.Screen
                name="posts/index"
                options={{ title: 'Posts' }}
              />
              <Stack.Screen
                name="posts/[id]"
                options={{ title: 'Post' }}
              />
              <Stack.Screen
                name="products/index"
                options={{ title: 'Products' }}
              />
              <Stack.Screen
                name="products/[id]"
                options={{ title: 'Product' }}
              />
              {/* Modal on native; a normal page on web */}
              <Stack.Screen
                name="user/[id]"
                options={{ title: 'User', presentation: isWeb ? 'card' : 'modal' }}
              />
            </Stack>
          </YStack>
        </ThemeProvider>
      </ThemeScope>
    </TamaguiProvider>
  )
}
