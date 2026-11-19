import type { RoutineExerciseData } from '@workspace/shared-utils'
import type { performedSets } from './db/schema'

// Ligne prête à insérer dans performed_sets
export type NewPerformedSet = typeof performedSets.$inferInsert

// Copie indépendante des séries cibles d'une routine, au démarrage d'une séance.
// newId est injecté : uuid aléatoire dans l'app, valeur fixe dans les tests
export function toPerformedSets(
  workoutId: string,
  exercisesData: RoutineExerciseData[],
  newId: () => string,
): NewPerformedSet[] {
  return exercisesData.flatMap(exercise =>
    exercise.targetSets.map(set => ({
      id: newId(),
      workoutId,
      exerciseId: exercise.exerciseId,
      exerciseOrder: exercise.order,
      setOrder: set.order,
      reps: set.reps,
      weight: set.weight,
      restSeconds: set.restSeconds,
      completed: false,
    })),
  )
}
