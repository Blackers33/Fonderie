import type { AuthResponse } from '@workspace/shared-utils'
import { type AuthErrorCode, toAuthErrorCode } from './auth-errors'

export type AuthResult = { ok: true; data: AuthResponse } | { ok: false; error: AuthErrorCode }
const REQUEST_TIMEOUT_MS = 15_000

// Notation pointée obligatoire : Expo remplace cette expression par sa valeur au build
const API_URL = process.env.EXPO_PUBLIC_API_URL

async function postAuth(path: string, body: object): Promise<AuthResult> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
  } catch {
    // Pas de réponse : réseau coupé, serveur injoignable, ou délai dépassé (abort)
    return { ok: false, error: 'network' }
  } finally {
    clearTimeout(timeoutId)
  }

  if (!response.ok) {
    return { ok: false, error: toAuthErrorCode(response.status) }
  }
  return { ok: true, data: (await response.json()) as AuthResponse }
}

export function register(id: string, email: string, password: string): Promise<AuthResult> {
  return postAuth('/auth/register', { id, email, password })
}

export function login(email: string, password: string): Promise<AuthResult> {
  return postAuth('/auth/login', { email, password })
}
