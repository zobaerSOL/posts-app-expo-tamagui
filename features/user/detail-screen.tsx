import { useRouter } from 'expo-router'
import { Button, Paragraph, YStack } from 'tamagui'
import { ChevronLeft } from '../../components/icons'

export function UserDetailScreen({ id }: { id: string }) {
  const router = useRouter()
  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      gap="4"
      backgroundColor="background"
    >
      <Paragraph
        fontWeight="700"
        color="blue10"
      >{`User ID: ${id}`}</Paragraph>
      <Button
        icon={ChevronLeft}
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
      >
        Go back
      </Button>
    </YStack>
  )
}
