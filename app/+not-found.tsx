import type { GenerateMetadataFunction } from 'expo-router/server'
import { Link } from 'expo-router'
import { H2, Paragraph, YStack } from 'tamagui'

export const generateMetadata: GenerateMetadataFunction = () => ({
  title: 'Page not found',
  robots: { index: false },
})

export default function NotFound() {
  return (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      gap="3"
      padding="4"
    >
      <H2>Page not found</H2>
      <Paragraph>This route does not exist.</Paragraph>
      <Link href="/">Go to home</Link>
    </YStack>
  )
}
