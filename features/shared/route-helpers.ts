import { StatusError } from 'expo-server'
import { NotFoundError } from '../http'

// Runs a loader body and maps an upstream 404 to a real HTTP 404 (StatusError).
export async function orNotFound<T>(run: () => Promise<T>): Promise<T> {
  try {
    return await run()
  } catch (e) {
    if (e instanceof NotFoundError) throw new StatusError(404, e.message)
    throw e
  }
}

export const truncate = (text: string, max = 160) =>
  text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text
