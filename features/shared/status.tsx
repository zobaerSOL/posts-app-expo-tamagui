import type { ErrorBoundaryProps } from 'expo-router'
import { Link } from 'expo-router'
import { Button, H2, Paragraph, YStack } from 'tamagui'

// Shared route ErrorBoundary: loader failures (including a 404 StatusError) land here.
export function RouteError({ error, retry }: ErrorBoundaryProps) {
  return (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      padding="4"
      gap="3"
    >
      <H2>Something went wrong</H2>
      <Paragraph color="red10">{error.message}</Paragraph>
      <Button onPress={retry}>Try again</Button>
      <Link href="/">Back to home</Link>
    </YStack>
  )
}
