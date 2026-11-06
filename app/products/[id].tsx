import { useLoaderData } from 'expo-router'
import { createStaticLoader } from 'expo-server'
import type { GenerateMetadataFunction } from 'expo-router/server'
import { fetchProduct } from '../../features/products/api'
import { ProductDetailScreen } from '../../features/products/detail-screen'
import { orNotFound, truncate } from '../../features/shared/route-helpers'
import { RouteError } from '../../features/shared/status'

export const loader = createStaticLoader(async (params) => ({
  product: await orNotFound(() => fetchProduct(String(params.id))),
}))

export const generateMetadata: GenerateMetadataFunction = async (_request, params) => {
  try {
    const product = await fetchProduct(String(params.id))
    return {
      title: `${product.title} | ShopHub`,
      description: truncate(product.description),
      openGraph: { title: product.title, images: product.thumbnail },
    }
  } catch {
    return { title: 'Product not found | ShopHub', robots: { index: false } }
  }
}

export { RouteError as ErrorBoundary }

export default function ProductRoute() {
  const { product } = useLoaderData<typeof loader>()
  return <ProductDetailScreen product={product} />
}
