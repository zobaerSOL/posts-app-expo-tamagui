import { Link } from 'expo-router'
import { Image, Paragraph, XStack, YStack } from 'tamagui'
import { Star } from '../../components/icons'
import type { Product } from './api'

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      asChild
    >
      <YStack
        render="a"
        width="100%"
        borderWidth={1}
        borderRadius="4"
        overflow="hidden"
        backgroundColor="background press:backgroundPress"
        borderColor="borderColor hover:color8"
      >
        <YStack
          backgroundColor="color3"
          aspectRatio={1}
        >
          <Image
            src={product.thumbnail}
            alt={product.title}
            width="100%"
            height="100%"
            objectFit="contain"
          />
        </YStack>
        <YStack
          padding="3"
          gap="1"
        >
          <Paragraph
            size="2"
            opacity={0.6}
            textTransform="capitalize"
            numberOfLines={1}
          >
            {product.category.replace(/-/g, ' ')}
          </Paragraph>
          <Paragraph
            fontWeight="700"
            numberOfLines={1}
          >
            {product.title}
          </Paragraph>
          <XStack
            alignItems="center"
            justifyContent="space-between"
          >
            <Paragraph
              fontWeight="800"
              size="5"
            >
              ${product.price.toFixed(2)}
            </Paragraph>
            <XStack
              alignItems="center"
              gap="1"
            >
              <Star
                size={14}
                color="yellow10"
              />
              <Paragraph size="2">{product.rating.toFixed(1)}</Paragraph>
            </XStack>
          </XStack>
        </YStack>
      </YStack>
    </Link>
  )
}

// Cells use padding + a negative container margin instead of `gap`, so percentage widths
// always fit: 2 columns on phones, 3 on tablets, 4 on desktop.
export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <XStack
      flexWrap="wrap"
      marginHorizontal="-2"
    >
      {products.map((product) => (
        <YStack
          key={product.id}
          width="50% sm:33.3333% lg:25%"
          padding="2"
        >
          <ProductCard product={product} />
        </YStack>
      ))}
    </XStack>
  )
}
