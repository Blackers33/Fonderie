import * as SecureStore from 'expo-secure-store'
import Storage from 'expo-sqlite/kv-store'
import type { Identity } from './identity'

// SecureStore (Keychain / Keystore) : contient le token, donc stockage chiffré (OWASP M9)
const IDENTITY_KEY = 'identity'
// kv-store (SQLite) : effacé à la désinstallation, contrairement au Keychain iOS
const HAS_LAUNCHED_BEFORE_KEY = 'hasLaunchedBefore'

export async function readStoredIdentity(): Promise<Identity | null> {
  const raw = await SecureStore.getItemAsync(IDENTITY_KEY)
  return raw ? (JSON.parse(raw) as Identity) : null
}

// Une seule clé JSON : userId et accessToken sont toujours écrits ensemble (atomique)
export async function saveIdentity(identity: Identity): Promise<void> {
  await SecureStore.setItemAsync(IDENTITY_KEY, JSON.stringify(identity))
}

export async function clearStoredIdentity(): Promise<void> {
  await SecureStore.deleteItemAsync(IDENTITY_KEY)
}

export async function readHasLaunchedBefore(): Promise<boolean> {
  return (await Storage.getItemAsync(HAS_LAUNCHED_BEFORE_KEY)) !== null
}

export async function markAsLaunched(): Promise<void> {
  await Storage.setItemAsync(HAS_LAUNCHED_BEFORE_KEY, 'true')
}
