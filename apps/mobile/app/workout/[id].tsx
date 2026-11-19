import { Stack, useLocalSearchParams } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { SectionList, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from '@/components/ui/text'
import { useWorkout } from '@/hooks/use-workout'
import { useIdentity } from '@/lib/auth/identity-context'

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
          <View className="flex-row gap-4 py-1">
            {/* Les séries sont numérotées à partir de 1 à l'écran */}
            <Text className="w-6 text-muted-foreground">{index + 1}</Text>
            <Text className="text-foreground">
              {t('workout.setLine', { reps: item.reps, weight: item.weight })}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  )
}
