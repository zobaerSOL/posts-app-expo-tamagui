import { Link, useRouter } from 'expo-router'
import { Button, H2, Paragraph, ScrollView, YStack } from 'tamagui'
import type { Post } from './api'

export function PostDetailScreen({ post }: { post: Post }) {
  const router = useRouter()
  return (
    <ScrollView>
      <YStack
        padding="4"
        gap="3"
        maxWidth={720}
        width="100%"
        alignSelf="center"
      >
        <Button
          alignSelf="flex-start"
          onPress={() => router.back()}
        >
          Back
        </Button>
        <H2>{post.title}</H2>
        <Paragraph opacity={0.6}>
          Post #{post.id} by <Link href={`/user/${post.userId}`}>user {post.userId}</Link>
        </Paragraph>
        <Paragraph size="5">{post.body}</Paragraph>
      </YStack>
    </ScrollView>
  )
}
