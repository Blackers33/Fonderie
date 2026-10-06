import { PASSWORD_MIN_LENGTH } from '@workspace/shared-utils'

// Volontairement simple (x@y.z, sans espaces) : attrape les fautes de frappe évidentes,
// le serveur (@IsEmail) a le dernier mot.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(email: string): 'invalidEmail' | null {
  return EMAIL_PATTERN.test(email) ? null : 'invalidEmail'
}

export function validatePassword(password: string): 'passwordTooShort' | null {
  return password.length >= PASSWORD_MIN_LENGTH ? null : 'passwordTooShort'
}
