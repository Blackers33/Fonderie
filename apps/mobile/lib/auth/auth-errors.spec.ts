import { describe, expect, it } from 'vitest'
import { toAuthErrorCode } from './auth-errors'

describe('toAuthErrorCode', () => {
  it('maps 409 (register) to emailTaken', () => {
    expect(toAuthErrorCode(409)).toBe('emailTaken')
  })

  it('maps 401 (login) to invalidCredentials', () => {
    expect(toAuthErrorCode(401)).toBe('invalidCredentials')
  })

  // 400 ne devrait pas arriver : le formulaire valide avant l'envoi
  it('maps any other status to unknown', () => {
    expect(toAuthErrorCode(400)).toBe('unknown')
    expect(toAuthErrorCode(500)).toBe('unknown')
  })
})
