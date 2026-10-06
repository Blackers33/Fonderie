// Identité locale du User. accessToken null = Guest (pas d'Account).
export type Identity = {
  userId: string
  accessToken: string | null
}

export type StartupIdentity = {
  identity: Identity | null // identité qui fait foi pour cette session
  shouldClearStoredIdentity: boolean // true = reliquat d'une installation précédente (iOS)
}

export function resolveStartupIdentity(
  hasLaunchedBefore: boolean,
  storedIdentity: Identity | null,
): StartupIdentity {
  if (!hasLaunchedBefore) {
    return { identity: null, shouldClearStoredIdentity: true }
  }
  return { identity: storedIdentity, shouldClearStoredIdentity: false }
}
