import { ApiError } from './errors'
import { mockAsk } from './mock'
import type { ApiErrorBody, AskRequest, AskResponse } from './types'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

export async function ask(req: AskRequest, signal?: AbortSignal): Promise<AskResponse> {
  if (USE_MOCK) return mockAsk(req, signal)

  let res: Response
  try {
    res = await fetch(`${API_BASE_URL}/api/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
      signal,
    })
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err
    throw new ApiError('NETWORK', 'Não foi possível conectar ao servidor.')
  }

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as ApiErrorBody | null
    throw new ApiError(
      body?.error.code ?? 'INTERNAL',
      body?.error.message ?? `Erro inesperado (HTTP ${res.status}).`,
    )
  }

  return (await res.json()) as AskResponse
}

export const isMockMode = USE_MOCK
export { ApiError }
