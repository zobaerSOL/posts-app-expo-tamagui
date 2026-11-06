import { useLoaderData } from 'expo-router'
import { createStaticLoader } from 'expo-server'
import type { GenerateMetadataFunction } from 'expo-router/server'
import { HomeScreen } from '../features/home/screen'
import { fetchProducts } from '../features/products/api'
import { RouteError } from '../features/shared/status'

export const loader = createStaticLoader(async () => ({ products: await fetchProducts(8) }))

export const generateMetadata: GenerateMetadataFunction = () => ({
  title: 'ShopHub: Expo Router pilot',
  description: 'Catalog and blog rendered by Expo Router on web, iOS and Android.',
})

export { RouteError as ErrorBoundary }

export default function Home() {
  const { products } = useLoaderData<typeof loader>()
  return <HomeScreen products={products} />
}
