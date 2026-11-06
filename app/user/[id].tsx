import { useLocalSearchParams } from 'expo-router'
import type { GenerateMetadataFunction } from 'expo-router/server'
import { UserDetailScreen } from '../../features/user/detail-screen'

export const generateMetadata: GenerateMetadataFunction = (_request, params) => ({
  title: `User ${params.id} | ShopHub`,
})

export default function UserRoute() {
  const { id } = useLocalSearchParams<{ id: string }>()
  return <UserDetailScreen id={id} />
}
