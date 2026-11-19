import { router, Stack, useLocalSearchParams } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { FlatList, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { useRoutinePreviews } from '@/hooks/use-routine-previews'
import { useIdentity } from '@/lib/auth/identity-context'
import { startWorkout } from '@/lib/start-workout'

export default function RoutineDetailScreen() {
  const { t } = useTranslation()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { identity } = useIdentity()
  const userId = identity?.userId ?? ''
  const { routines } = useRoutinePreviews(userId)
  const routine = routines.find(r => r.id === id)

  function handleStart() {
    const workoutId = startWorkout(userId, id)
    router.replace(`/workout/${workoutId}`)
  }
  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-background">
      <Stack.Screen options={{ title: routine?.name ?? '' }} />
      <FlatList
        contentContainerClassName="gap-2 p-4"
        data={routine?.exercises ?? []}
        keyExtractor={exercise => exercise.exerciseId}
        renderItem={({ item }) => (
          <View className="flex-row items-center justify-between">
            <Text className="text-base text-foreground">{item.name}</Text>
            <Text className="text-sm text-muted-foreground">
              {t('routineCard.setsCount', { count: item.setCount })}
            </Text>
          </View>
        )}
      />
      <View className="p-4">
        <Button onPress={handleStart}>
          <Text>{t('routineDetail.startWorkout')}</Text>
        </Button>
      </View>
    </SafeAreaView>
  )
}
