import { H2, Paragraph, ScrollView, YStack } from 'tamagui'
import type { Product } from './api'
import { ProductGrid } from './product-grid'

export function ProductListScreen({ products }: { products: Product[] }) {
  return (
    <ScrollView>
      <YStack
        padding="4"
        gap="3"
        maxWidth={1100}
        width="100%"
        alignSelf="center"
      >
        <H2>All products</H2>
        {products.length === 0 ? <Paragraph>No products found.</Paragraph> : null}
        <ProductGrid products={products} />
      </YStack>
    </ScrollView>
  )
}
