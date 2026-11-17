import { ThemeProvider } from '@react-navigation/native'
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import 'react-native-reanimated'
import { PortalHost } from '@rn-primitives/portal'
import * as SplashScreen from 'expo-splash-screen'
import { IdentityProvider, useIdentity } from '@/lib/auth/identity-context'
import '../global.css'
import '@/lib/i18n'
import { registerDevMenuItems } from 'expo-dev-menu'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { db } from '@/lib/db/client'
import { seedDemoData } from '@/lib/dev/demo-seed'
import {
  ensureRestTimerChannel,
  requestNotificationPermission,
  scheduleRestTimerEnd,
} from '@/lib/notifications/rest-timer-notifications'
import { NAV_THEME } from '@/lib/theme'
import migrations from '../drizzle/migrations'

// Garde le splash natif affiché jusqu'à ce que RootNavigator appelle hideAsync()
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const colorScheme = useColorScheme()

  const { success, error } = useMigrations(db, migrations)

  useEffect(() => {
    if (error) {
      console.error('Database migration failed', error)
    }
  }, [error])

  if (!success) {
    return null
  }

  return (
    <KeyboardProvider>
      <ThemeProvider value={colorScheme === 'dark' ? NAV_THEME.dark : NAV_THEME.light}>
        <IdentityProvider>
          <RootNavigator />
        </IdentityProvider>
        <StatusBar style="auto" />
        <PortalHost />
      </ThemeProvider>
    </KeyboardProvider>
  )
}

function RootNavigator() {
  const { identity, isLoading, clearIdentity } = useIdentity()

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync()
    }
  }, [isLoading])

  useEffect(() => {
    // Module natif absent en release : l'appeler hors dev ferait planter l'app
    if (!__DEV__) return

    // Créée À CHAQUE exécution de l'effet → voit l'identity du rendu courant (pas celle du 1er rendu)
    async function seedForCurrentUser() {
      if (identity === null) return // pas encore d'identité (onboarding) : rien à seeder
      try {
        await seedDemoData(identity.userId)
      } catch (error) {
        // Pas d'Alert : l'accueil (useLiveQuery) se remplira tout seul en cas de succès
        console.error('[dev] seed failed:', error)
      }
    }

    // registerDevMenuItems REMPLACE toute la liste : on redonne les 3 entrées à chaque fois
    registerDevMenuItems([
      // Rejouer l'onboarding sans vider le cache de l'application : supprimer l'identité stockée, puis re rendu
      { name: 'Reset identity', callback: clearIdentity, shouldCollapse: true },
      // shouldCollapse : ferme le menu, sinon il masque la demande de permission
      { name: 'Test notification (60 s)', callback: testRestNotification, shouldCollapse: true },
      { name: 'Seed demo data', callback: seedForCurrentUser, shouldCollapse: true },
    ])
  }, [identity, clearIdentity])

  if (isLoading) {
    return null // le splash natif est toujours affiché par-dessus
  }

  return (
    <Stack>
      <Stack.Protected guard={identity === null}>
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" />
      </Stack.Protected>
      <Stack.Protected guard={identity !== null}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack.Protected>
    </Stack>
  )
}

// SPIKE TP — à supprimer quand #50 sera branché sur le vrai minuteur.
// Mesure le délai réel de livraison, téléphone verrouillé.
async function testRestNotification() {
  await ensureRestTimerChannel('Rest timer') // canal AVANT la permission (Android 13)
  const permission = await requestNotificationPermission()
  console.log('[spike] notification permission:', permission)
  if (permission !== 'granted') return

  // L'heure prévue est écrite dans la notif : on la compare à l'heure d'arrivée
  const due = new Date(Date.now() + 60_000).toLocaleTimeString()
  await scheduleRestTimerEnd(60, { title: 'Spike', body: `Due at ${due}` })
}
