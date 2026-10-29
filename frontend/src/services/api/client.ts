const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333').replace(/\/$/, '')
const API_SERVER_ORIGIN = (process.env.API_SERVER_ORIGIN ?? 'http://localhost:8080').replace(/\/$/, '')

export const AUTH_TOKEN_COOKIE = 'central_ocorrencias_token'

type QueryValue = string | number | boolean | null | undefined

type JsonBody = Record<string, unknown> | unknown[]

export type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: BodyInit | JsonBody | null
  query?: Record<string, QueryValue>
  token?: string | null
}

export class ApiError extends Error {
  readonly status: number
  readonly data: unknown

  constructor(message: string, status: number, data?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

export function buildApiUrl(path: string, query?: Record<string, QueryValue>) {
  const target = path.startsWith('http') ? path : `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
  const origin = typeof window === 'undefined' ? API_SERVER_ORIGIN : window.location.origin
  const url = new URL(target, origin)

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value))
      }
    }
  }

  return url.toString()
}

function getCookieValue(name: string) {
  if (typeof document === 'undefined') {
    return null
  }

  const cookie = document.cookie
    .split(';')
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`))

  if (!cookie) {
    return null
  }

  try {
    return decodeURIComponent(cookie.slice(name.length + 1))
  } catch {
    return cookie.slice(name.length + 1)
  }
}

export function getAuthToken() {
  return getCookieValue(AUTH_TOKEN_COOKIE)
}

export function setAuthToken(token: string, maxAgeInSeconds = 60 * 60 * 24 * 7) {
  if (typeof document === 'undefined') {
    return
  }

  document.cookie = `${AUTH_TOKEN_COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAgeInSeconds}; SameSite=Lax`
}

export function clearAuthToken() {
  if (typeof document === 'undefined') {
    return
  }

  document.cookie = `${AUTH_TOKEN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`
}

function isFormData(body: ApiRequestOptions['body']): body is FormData {
  return typeof FormData !== 'undefined' && body instanceof FormData
}

async function parseResponseBody(response: Response) {
  if (response.status === 204) {
    return null
  }

  const text = await response.text()

  if (!text) {
    return null
  }

  try {
    return JSON.parse(text) as unknown
  } catch {
    return text
  }
}

function getErrorMessage(data: unknown, fallback: string) {
  if (data && typeof data === 'object') {
    if ('error' in data && typeof data.error === 'string') {
      return data.error
    }

    if ('message' in data && typeof data.message === 'string') {
      return data.message
    }
  }

  return fallback
}

export async function apiFetch<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { body, headers, query, token, ...requestInit } = options
  const requestHeaders = new Headers(headers)
  const authToken = token === undefined ? getAuthToken() : token

  if (authToken) {
    requestHeaders.set('Authorization', `Bearer ${authToken}`)
  }

  let requestBody: BodyInit | undefined

  if (isFormData(body)) {
    requestBody = body
  } else if (body !== undefined && body !== null) {
    requestHeaders.set('Content-Type', 'application/json')
    requestBody = JSON.stringify(body)
  }

  const response = await fetch(buildApiUrl(path, query), {
    ...requestInit,
    cache: requestInit.cache ?? 'no-store',
    headers: requestHeaders,
    body: requestBody,
  }).catch(() => {
    throw new ApiError('Não foi possível conectar ao servidor. Tente novamente em instantes.', 0)
  })

  const data = await parseResponseBody(response)

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(data, `Não foi possível concluir a requisição (${response.status}).`),
      response.status,
      data,
    )
  }

  return data as T
}
