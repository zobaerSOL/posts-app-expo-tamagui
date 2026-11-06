// Public API: https://dummyjson.com/docs/products
import { getJson } from '../http'

export type Product = {
  id: number
  title: string
  description: string
  category: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand?: string
  thumbnail: string
  images: string[]
}

type ProductsResponse = { products: Product[]; total: number; skip: number; limit: number }

// Not EXPO_PUBLIC_, so it is never inlined into a client bundle. Falls back to the public API.
const baseUrl = () => process.env.PRODUCTS_API_BASE_URL ?? 'https://dummyjson.com'

export async function fetchProducts(limit = 20): Promise<Product[]> {
  const data = await getJson<ProductsResponse>(`${baseUrl()}/products?limit=${limit}`, 'products')
  return data.products
}

export const fetchProduct = (id: string | number) =>
  getJson<Product>(`${baseUrl()}/products/${encodeURIComponent(String(id))}`, `product ${id}`)
