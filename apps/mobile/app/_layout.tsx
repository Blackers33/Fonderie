import { ThemeProvider } from '@react-navigation/native'
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import 'react-native-reanimated'
import { PortalHost } from '@rn-primitives/portal'
import * as SplashScreen from 'expo-splash-screen'
import { useColorScheme as useNativewindColorScheme } from 'nativewind'
import { IdentityProvider, useIdentity } from '@/lib/auth/identity-context'
import '../global.css'
import '@/lib/i18n'
import { registerDevMenuItems } from 'expo-dev-menu'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { db } from '@/lib/db/client'
import { NAV_THEME } from '@/lib/theme'
import migrations from '../drizzle/migrations'

// Garde le splash natif affiché jusqu'à ce que RootNavigator appelle hideAsync()
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const { setColorScheme } = useNativewindColorScheme()
  const { success, error } = useMigrations(db, migrations)

  useEffect(() => {
    setColorScheme(colorScheme ?? 'light')
  }, [colorScheme, setColorScheme])

  useEffect(() => {
    if (error) {
      console.error('Database migration failed', error)
    }
  }, [error])

  if (!success) {
    return null
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? NAV_THEME.dark : NAV_THEME.light}>
      <IdentityProvider>
        <RootNavigator />
      </IdentityProvider>
      <StatusBar style="auto" />
      <PortalHost />
    </ThemeProvider>
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
    // Rejouer l'onboarding sans vider le cache de l'application : supprimer l'identité stockée, puis re rendu
    registerDevMenuItems([
      { name: 'Reset identity', callback: clearIdentity, shouldCollapse: true },
    ])
  }, [clearIdentity])

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
