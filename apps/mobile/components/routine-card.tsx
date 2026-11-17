import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { EXERCISE_TYPES, type ExerciseType, getExerciseTypeColor } from '@/lib/exercise-types'
import type { RoutinePreview } from '@/lib/routine-preview'

const PREVIEW_COUNT = 3

type RoutineCardProps = {
  routine: RoutinePreview
  onPress?: () => void
}

function RoutineCard({ routine, onPress }: RoutineCardProps) {
  const isDark = useColorScheme() === 'dark'
  const { t } = useTranslation()
  const previewedExercises = routine.exercises.slice(0, PREVIEW_COUNT)
  const remainingCount = routine.exercises.length - previewedExercises.length
  // Types présents dans la routine, dans l'ordre de EXERCISE_TYPES.
  // Un type null ne correspond à aucun type → ignoré tout seul.
  const presentTypes = (Object.keys(EXERCISE_TYPES) as ExerciseType[]).filter(type =>
    routine.exercises.some(exercise => exercise.type === type),
  )

  return (
    <Pressable onPress={onPress}>
      <Card className="w-full py-4">
        <CardContent className="gap-3">
          <View className="flex-row items-start justify-between gap-2">
            <View className="shrink">
              <Text className="text-base font-semibold text-foreground">{routine.name}</Text>
              <Text className="text-xs text-muted-foreground">
                {t('routineCard.exerciseCount', { count: routine.exercises.length })}
              </Text>
            </View>
          </View>

          <View className="gap-1">
            {previewedExercises.map(exercise => (
              <View key={exercise.exerciseId} className="flex-row items-center gap-2">
                <View
                  // Gris par défaut (type inconnu) ; NativeWind applique la classe d'abord…
                  className="h-2 w-2 rounded-full bg-muted-foreground"
                  // …puis `style` la remplace UNIQUEMENT si un type est connu
                  style={
                    exercise.type !== null
                      ? { backgroundColor: getExerciseTypeColor(exercise.type, isDark) }
                      : undefined
                  }
                />

                <Text className="text-sm text-foreground">{exercise.name}</Text>
                <Text className="ml-auto text-xs text-muted-foreground">
                  {t('routineCard.setsCount', { count: exercise.setCount })}
                </Text>
              </View>
            ))}
            {remainingCount > 0 && (
              <Text className="text-xs text-muted-foreground">
                {t('routineCard.moreCount', { count: remainingCount })}
              </Text>
            )}
          </View>

          <View className="flex-row flex-wrap gap-1.5">
            {presentTypes.map(type => (
              <Badge key={type} color={getExerciseTypeColor(type, isDark)}>
                {t(EXERCISE_TYPES[type].label)}
              </Badge>
            ))}
          </View>
        </CardContent>
      </Card>
    </Pressable>
  )
}

export { RoutineCard }
