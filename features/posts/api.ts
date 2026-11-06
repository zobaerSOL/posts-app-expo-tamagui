// Public API: https://jsonplaceholder.typicode.com
// Only route loaders / generateMetadata call these, so they run on the Expo server.
import { getJson } from '../http'

export type Post = { id: number; userId: number; title: string; body: string }

// Not EXPO_PUBLIC_, so it is never inlined into a client bundle. Falls back to the public API.
const baseUrl = () => process.env.API_BASE_URL ?? 'https://jsonplaceholder.typicode.com'

export const fetchPosts = (limit = 20) =>
  getJson<Post[]>(`${baseUrl()}/posts?_limit=${limit}`, 'posts')

export const fetchPost = (id: string | number) =>
  getJson<Post>(`${baseUrl()}/posts/${encodeURIComponent(String(id))}`, `post ${id}`)
