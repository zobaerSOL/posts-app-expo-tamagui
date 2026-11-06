// Shared fetch helper. A 404 from the upstream API becomes NotFoundError so route loaders can
// turn it into a real HTTP 404 (StatusError) instead of a generic failure.
export class NotFoundError extends Error {
  constructor(what: string) {
    super(`${what} not found`)
    this.name = 'NotFoundError'
  }
}

export async function getJson<T>(url: string, what: string): Promise<T> {
  const res = await fetch(url)
  if (res.status === 404) throw new NotFoundError(what)
  if (!res.ok) throw new Error(`Failed to load ${what} (${res.status})`)
  return (await res.json()) as T
}
