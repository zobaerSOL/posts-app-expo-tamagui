import { Link } from 'expo-router'
import { H2, Paragraph, ScrollView, YStack } from 'tamagui'
import type { Post } from './api'

export function PostListScreen({ posts }: { posts: Post[] }) {
  return (
    <ScrollView>
      <YStack
        padding="4"
        gap="3"
        maxWidth={720}
        width="100%"
        alignSelf="center"
      >
        <H2>Posts</H2>
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/posts/${post.id}`}
            asChild
          >
            <YStack
              render="a"
              padding="3"
              borderWidth={1}
              borderColor="borderColor"
              borderRadius="4"
              backgroundColor="transparent hover:backgroundHover press:backgroundPress"
            >
              <Paragraph fontWeight="700">{post.title}</Paragraph>
              <Paragraph
                numberOfLines={2}
                opacity={0.7}
              >
                {post.body}
              </Paragraph>
            </YStack>
          </Link>
        ))}
      </YStack>
    </ScrollView>
  )
}
