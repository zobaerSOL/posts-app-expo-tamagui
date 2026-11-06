import { useLoaderData } from 'expo-router'
import { createStaticLoader } from 'expo-server'
import type { GenerateMetadataFunction } from 'expo-router/server'
import { fetchPosts } from '../../features/posts/api'
import { PostListScreen } from '../../features/posts/list-screen'
import { RouteError } from '../../features/shared/status'

export const loader = createStaticLoader(async () => ({ posts: await fetchPosts() }))

export const generateMetadata: GenerateMetadataFunction = () => ({
  title: 'Posts | ShopHub',
  description: 'Latest posts from the ShopHub blog.',
})

export { RouteError as ErrorBoundary }

export default function PostsRoute() {
  const { posts } = useLoaderData<typeof loader>()
  return <PostListScreen posts={posts} />
}
