import { Stack, useLocalSearchParams } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { SectionList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SetRow } from '@/components/set-row'
import { Text } from '@/components/ui/text'
import { useWorkout } from '@/hooks/use-workout'
import { useIdentity } from '@/lib/auth/identity-context'
import { updateSetCompleted } from '@/lib/update-set-completed'

export default function WorkoutScreen() {
  const { t } = useTranslation()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { identity } = useIdentity()
  const { name, sections } = useWorkout(identity?.userId ?? '', id)

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
            onToggle={updateSetCompleted}
          />
        )}
      />
    </SafeAreaView>
  )
}
