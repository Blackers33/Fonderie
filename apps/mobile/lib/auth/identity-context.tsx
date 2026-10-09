import { createContext, type PropsWithChildren, useContext, useEffect, useState } from 'react'
import { type Identity, resolveStartupIdentity } from './identity'
import {
  clearStoredIdentity,
  markAsLaunched,
  readHasLaunchedBefore,
  readStoredIdentity,
  saveIdentity,
} from './identity-storage'

type IdentityContextValue = {
  identity: Identity | null
  isLoading: boolean
  updateIdentity: (identity: Identity) => Promise<void>
  clearIdentity: () => Promise<void>
}

const IdentityContext = createContext<IdentityContextValue | null>(null)

export function IdentityProvider({ children }: PropsWithChildren) {
  const [identity, setIdentity] = useState<Identity | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadIdentity() {
      // TODO : si SecureStore/kv-store lèvent une erreur, isLoading reste true → splash bloqué à vie.
      // Piste : try/catch → démarrer sans identité. Attention : un nouveau choix "Invité" créerait
      // un nouvel UUID, les données existantes resteraient rattachées à l'ancien.

      // Les deux lectures sont indépendantes : on les lance en parallèle
      const [hasLaunchedBefore, storedIdentity] = await Promise.all([
        readHasLaunchedBefore(),
        readStoredIdentity(),
      ])
      const startup = resolveStartupIdentity(hasLaunchedBefore, storedIdentity)

      if (startup.shouldClearStoredIdentity) {
        // Premier lancement de cette installation : nettoyer d'abord,
        // marquer ensuite (le marqueur = "nettoyage terminé", rejouable si crash)
        await clearStoredIdentity()
        await markAsLaunched()
      }

      setIdentity(startup.identity)
      setIsLoading(false)
    }

    loadIdentity()
  }, [])
  async function updateIdentity(newIdentity: Identity) {
    // Persister d'abord : si l'écriture échoue, le state ne ment pas
    await saveIdentity(newIdentity)
    setIdentity(newIdentity) // déclenche le re-rendu → Stack.Protected redirige
  }

  async function clearIdentity() {
    await clearStoredIdentity()
    setIdentity(null)
  }

  return (
    <IdentityContext.Provider value={{ identity, isLoading, updateIdentity, clearIdentity }}>
      {children}
    </IdentityContext.Provider>
  )
}

export function useIdentity(): IdentityContextValue {
  const value = useContext(IdentityContext)
  if (!value) {
    throw new Error('useIdentity must be used within IdentityProvider')
  }
  return value
}
