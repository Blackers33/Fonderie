import { router, Stack, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, AppState, Linking, Platform, SectionList, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { RestTimer } from '@/components/rest-timer'
import { SetRow } from '@/components/set-row'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { useWorkout } from '@/hooks/use-workout'
import { useIdentity } from '@/lib/auth/identity-context'
import { finishWorkout } from '@/lib/finish-workout'
import {
  ensureRestTimerChannels,
  getNotificationPermission,
  type NotificationPermission,
  requestNotificationPermission,
  startRest,
  stopRest,
} from '@/lib/notifications/rest-timer-notifications'
import { updateSetCompleted } from '@/lib/update-set-completed'

export default function WorkoutScreen() {
  const { t } = useTranslation()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { identity } = useIdentity()
  const { name, sections } = useWorkout(identity?.userId ?? '', id)
  // Échéance du repos en cours (epoch ms), null = pas de repos
  const [restEndsAt, setRestEndsAt] = useState<number | null>(null)
  const [permission, setPermission] = useState<NotificationPermission | null>(null)

  useEffect(() => {
    if (Platform.OS !== 'android') return // pas de minuteur natif hors Android
    async function askPermission() {
      await ensureRestTimerChannels() // canaux avant la demande, sinon pas de pop-up (Android 13)
      setPermission(await requestNotificationPermission())
    }
    askPermission()
    // Retour des réglages (bouton « Ouvrir les réglages ») : la permission a pu changer
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') getNotificationPermission().then(setPermission)
    })
    return () => subscription.remove()
  }, [])

  function handleToggle(setId: string, completed: boolean, restSeconds: number) {
    updateSetCompleted(setId, completed)
    // Le repos démarre au cochage seulement ; 0 = pas de repos
    if (completed && restSeconds > 0) {
      const endsAt = Date.now() + restSeconds * 1000
      setRestEndsAt(endsAt)
      startRest(endsAt) // même échéance pour l'écran et le service
    }
  }

  function skipRest() {
    stopRest() // sinon l'alerte native partirait quand même
    setRestEndsAt(null)
  }

  function finish() {
    stopRest() // séance finie : plus d'alerte de repos
    finishWorkout(id)
    router.back()
  }

  function handleFinish() {
    const uncheckedCount = sections
      .flatMap(section => section.data)
      .filter(set => !set.completed).length
    if (uncheckedCount === 0) {
      finish()
      return
    }
    Alert.alert(
      t('workout.finishConfirmTitle'),
      t('workout.finishConfirmMessage', { count: uncheckedCount }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('workout.finish'), onPress: finish },
      ],
    )
  }
  // null (iOS, ou réponse pas encore reçue) : rien à signaler
  const notificationsOff = permission === 'denied' || permission === 'blocked'

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-background">
      <Stack.Screen options={{ title: name ?? '' }} />
      <SectionList
        contentContainerClassName="p-4"
        sections={sections}
        keyExtractor={set => set.id}
        ListHeaderComponent={
          notificationsOff ? (
            <View className="gap-1">
              <Text className="text-sm text-muted-foreground">{t('workout.notificationsOff')}</Text>
              {permission === 'blocked' && (
                // Android ne réaffichera plus la demande : seul recours, les réglages de l'app
                <Button
                  variant="link"
                  size="sm"
                  className="self-start px-0"
                  onPress={() => Linking.openSettings()}
                >
                  <Text>{t('workout.openSettings')}</Text>
                </Button>
              )}
            </View>
          ) : null
        }
        renderSectionHeader={({ section }) => (
          <Text className="mt-4 mb-1 text-base font-semibold text-foreground">{section.title}</Text>
        )}
        renderItem={({ item, index }) => (
          <SetRow
            setId={item.id}
            number={index + 1}
            label={t('workout.setLine', { reps: item.reps, weight: item.weight })}
            completed={item.completed}
            restSeconds={item.restSeconds}
            onToggle={handleToggle}
          />
        )}
      />
      <View className="gap-3 p-4">
        {restEndsAt !== null && (
          <RestTimer
            restEndsAt={restEndsAt}
            vibrate={permission !== 'granted'} // sinon c'est l'alerte native qui prévient
            onEnd={() => setRestEndsAt(null)}
            onSkip={skipRest}
          />
        )}
        <Button onPress={handleFinish}>
          <Text>{t('workout.finish')}</Text>
        </Button>
      </View>
    </SafeAreaView>
  )
}
