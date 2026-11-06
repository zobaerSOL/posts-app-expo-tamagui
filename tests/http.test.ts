import { StatusError } from 'expo-server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { getJson, NotFoundError } from '../features/http'
import { orNotFound } from '../features/shared/route-helpers'

afterEach(() => vi.unstubAllGlobals())

const stubFetch = (status: number, body: unknown = {}) =>
  vi.stubGlobal('fetch', async () => new Response(JSON.stringify(body), { status }))

describe('getJson', () => {
  it('returns parsed JSON on 200', async () => {
    stubFetch(200, { id: 1 })
    expect(await getJson('http://x/1', 'post 1')).toEqual({ id: 1 })
  })

  it('throws NotFoundError on 404', async () => {
    stubFetch(404)
    await expect(getJson('http://x/9', 'post 9')).rejects.toBeInstanceOf(NotFoundError)
  })

  it('throws a plain Error on 500', async () => {
    stubFetch(500)
    await expect(getJson('http://x/1', 'post 1')).rejects.toThrow('Failed to load post 1 (500)')
  })
})

describe('orNotFound', () => {
  it('maps NotFoundError to a 404 StatusError', async () => {
    const err = await orNotFound(async () => {
      throw new NotFoundError('post 9')
    }).catch((e: unknown) => e)
    expect(err).toBeInstanceOf(StatusError)
    expect((err as StatusError).status).toBe(404)
  })

  it('rethrows other errors untouched', async () => {
    await expect(
      orNotFound(async () => {
        throw new Error('boom')
      })
    ).rejects.toThrow('boom')
  })
})
