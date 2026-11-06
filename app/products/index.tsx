import { useLoaderData } from 'expo-router'
import { createStaticLoader } from 'expo-server'
import type { GenerateMetadataFunction } from 'expo-router/server'
import { fetchProducts } from '../../features/products/api'
import { ProductListScreen } from '../../features/products/list-screen'
import { RouteError } from '../../features/shared/status'

export const loader = createStaticLoader(async () => ({ products: await fetchProducts(20) }))

export const generateMetadata: GenerateMetadataFunction = () => ({
  title: 'All products | ShopHub',
  description: 'Browse the full ShopHub catalog.',
})

export { RouteError as ErrorBoundary }

export default function ProductsRoute() {
  const { products } = useLoaderData<typeof loader>()
  return <ProductListScreen products={products} />
}
