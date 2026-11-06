import { useLoaderData } from 'expo-router'
import type { GenerateMetadataFunction } from 'expo-router/server'
import { createStaticLoader } from 'expo-server'
import { fetchEmployeeHome } from '../features/home/api'
import { HomeScreen } from '../features/home/screen'
import { RouteError } from '../features/shared/status'

export const loader = createStaticLoader(async () => ({ home: await fetchEmployeeHome() }))

export const generateMetadata: GenerateMetadataFunction = () => ({
  title: 'Home | SOL HR Portal',
  description: 'Employee home: attendance punch, leave balance, requests and announcements.',
})

export { RouteError as ErrorBoundary }

export default function Home() {
  const { home } = useLoaderData<typeof loader>()
  return <HomeScreen data={home} />
}
