import { useRouter } from 'expo-router'
import { Button, H2, Image, Paragraph, ScrollView, XStack, YStack } from 'tamagui'
import { Star } from '../../components/icons'
import type { Product } from './api'

export function ProductDetailScreen({ product }: { product: Product }) {
  const router = useRouter()
  const oldPrice = product.price / (1 - product.discountPercentage / 100)
  return (
    <ScrollView>
      <YStack
        padding="4"
        gap="4"
        maxWidth={1100}
        width="100%"
        alignSelf="center"
      >
        <Button
          alignSelf="flex-start"
          onPress={() => router.back()}
        >
          Back
        </Button>
        {/* Stacked on phones, side by side from tablet width up */}
        <YStack
          gap="5"
          flexDirection="column sm:row"
        >
          <YStack
            width="100% sm:45%"
            aspectRatio={1}
            backgroundColor="color3"
            borderRadius="4"
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
            flex={1}
            gap="3"
          >
            <Paragraph
              size="2"
              opacity={0.6}
              textTransform="capitalize"
            >
              {product.brand ? `${product.brand} · ` : ''}
              {product.category.replace(/-/g, ' ')}
            </Paragraph>
            <H2>{product.title}</H2>
            <XStack
              alignItems="center"
              gap="1"
            >
              <Star
                size={16}
                color="yellow10"
              />
              <Paragraph>{product.rating.toFixed(1)}</Paragraph>
            </XStack>
            <XStack
              alignItems="baseline"
              gap="3"
              flexWrap="wrap"
            >
              <Paragraph
                size="8"
                fontWeight="800"
              >
                ${product.price.toFixed(2)}
              </Paragraph>
              <Paragraph
                textDecorationLine="line-through"
                opacity={0.5}
              >
                ${oldPrice.toFixed(2)}
              </Paragraph>
              <Paragraph
                color="green10"
                fontWeight="700"
              >
                {Math.round(product.discountPercentage)}% off
              </Paragraph>
            </XStack>
            <Paragraph size="5">{product.description}</Paragraph>
            <Paragraph opacity={0.6}>{product.stock} in stock</Paragraph>
          </YStack>
        </YStack>
      </YStack>
    </ScrollView>
  )
}
