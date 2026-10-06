import { describe, expect, it } from 'vitest'
import { type Identity, resolveStartupIdentity } from './identity'

const guest: Identity = { userId: 'guest-uuid', accessToken: null }

describe('resolveStartupIdentity', () => {
  it('starts without identity on the very first launch', () => {
    expect(resolveStartupIdentity(false, null)).toEqual({
      identity: null,
      shouldClearStoredIdentity: true,
    })
  })

  // iOS : SecureStore survit à la désinstallation, pas le SQLite
  it('ignores and clears an identity left over from a previous install', () => {
    expect(resolveStartupIdentity(false, guest)).toEqual({
      identity: null,
      shouldClearStoredIdentity: true,
    })
  })

  it('restores the stored identity on a later launch', () => {
    expect(resolveStartupIdentity(true, guest)).toEqual({
      identity: guest,
      shouldClearStoredIdentity: false,
    })
  })

  // Lancé une fois, mais l'utilisateur a quitté l'écran auth sans choisir
  it('starts without identity when none was ever chosen', () => {
    expect(resolveStartupIdentity(true, null)).toEqual({
      identity: null,
      shouldClearStoredIdentity: false,
    })
  })
})
