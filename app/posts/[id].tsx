import { useLoaderData } from 'expo-router'
import { createStaticLoader } from 'expo-server'
import type { GenerateMetadataFunction } from 'expo-router/server'
import { fetchPost } from '../../features/posts/api'
import { PostDetailScreen } from '../../features/posts/detail-screen'
import { orNotFound, truncate } from '../../features/shared/route-helpers'
import { RouteError } from '../../features/shared/status'

export const loader = createStaticLoader(async (params) => ({
  post: await orNotFound(() => fetchPost(String(params.id))),
}))

// Runs separately from the loader, so the post is fetched twice per request.
export const generateMetadata: GenerateMetadataFunction = async (_request, params) => {
  try {
    const post = await fetchPost(String(params.id))
    return { title: `${post.title} | ShopHub`, description: truncate(post.body) }
  } catch {
    return { title: 'Post not found | ShopHub', robots: { index: false } }
  }
}

export { RouteError as ErrorBoundary }

export default function PostRoute() {
  const { post } = useLoaderData<typeof loader>()
  return <PostDetailScreen post={post} />
}
