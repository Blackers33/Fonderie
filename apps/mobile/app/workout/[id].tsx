import { router, Stack, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, SectionList, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { RestTimer } from '@/components/rest-timer'
import { SetRow } from '@/components/set-row'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { useWorkout } from '@/hooks/use-workout'
import { useIdentity } from '@/lib/auth/identity-context'
import { finishWorkout } from '@/lib/finish-workout'
import { updateSetCompleted } from '@/lib/update-set-completed'

export default function WorkoutScreen() {
  const { t } = useTranslation()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { identity } = useIdentity()
  const { name, sections } = useWorkout(identity?.userId ?? '', id)
  // Échéance du repos en cours (epoch ms), null = pas de repos
  const [restEndsAt, setRestEndsAt] = useState<number | null>(null)

  function handleToggle(setId: string, completed: boolean, restSeconds: number) {
    updateSetCompleted(setId, completed)
    // Le repos démarre au cochage seulement ; 0 = pas de repos
    if (completed && restSeconds > 0) {
      setRestEndsAt(Date.now() + restSeconds * 1000)
    }
  }

  function finish() {
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

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-background">
      <Stack.Screen options={{ title: name ?? '' }} />
      <SectionList
        contentContainerClassName="p-4"
        sections={sections}
        keyExtractor={set => set.id}
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
          <RestTimer restEndsAt={restEndsAt} onEnd={() => setRestEndsAt(null)} />
        )}
        <Button onPress={handleFinish}>
          <Text>{t('workout.finish')}</Text>
        </Button>
      </View>
    </SafeAreaView>
  )
}
