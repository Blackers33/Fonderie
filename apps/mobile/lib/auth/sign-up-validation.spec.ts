import { PASSWORD_MIN_LENGTH } from '@workspace/shared-utils'
import { describe, expect, it } from 'vitest'
import { validateEmail, validatePassword } from './sign-up-validation'

describe('validateEmail', () => {
  it('accepts a regular email', () => {
    expect(validateEmail('lea@mail.com')).toBeNull()
  })

  it.each(['', 'lea', 'lea@mail', 'lea @mail.com'])('rejects %j', email => {
    expect(validateEmail(email)).toBe('invalidEmail')
  })
})

describe('validatePassword', () => {
  it('rejects a password one character too short', () => {
    expect(validatePassword('a'.repeat(PASSWORD_MIN_LENGTH - 1))).toBe('passwordTooShort')
  })

  it('accepts a password of exactly the minimum length', () => {
    expect(validatePassword('a'.repeat(PASSWORD_MIN_LENGTH))).toBeNull()
  })
})
