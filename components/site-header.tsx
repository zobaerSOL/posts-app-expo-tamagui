import { Link } from 'expo-router'
import { H4, Paragraph, XStack } from 'tamagui'
import { SwitchThemeButton } from './theme'

// Web-only site chrome. Native keeps the Stack navigator's own header.
export function SiteHeader() {
  return (
    <XStack
      height={60}
      paddingHorizontal="4"
      alignItems="center"
      gap="4"
      borderBottomWidth={1}
      borderBottomColor="borderColor"
      backgroundColor="background"
    >
      <Link href="/">
        <H4>ShopHub</H4>
      </Link>
      <Link href="/products">
        <Paragraph fontWeight="600">Products</Paragraph>
      </Link>
      <Link href="/posts">
        <Paragraph fontWeight="600">Posts</Paragraph>
      </Link>
      <XStack flex={1} />
      <SwitchThemeButton />
    </XStack>
  )
}
