// apps/mobile/lib/routine-preview.ts
// Imports RELATIFS : Vitest ne connaît pas l'alias '@/…'
import type { exercises, routines } from './db/schema'
import { type ExerciseType, getExerciseType } from './exercise-types'

// Type d'une ligne, déduit du schéma Drizzle
type Routine = typeof routines.$inferSelect
type Exercise = typeof exercises.$inferSelect

// Ce dont la fonction a besoin d'un exercice du catalogue (une ligne complète convient aussi)
export type CatalogExercise = Pick<Exercise, 'name' | 'primaryMuscle' | 'category'>

// Une ligne d'exercice telle que la carte l'affiche
export type RoutinePreviewExercise = {
  exerciseId: string // key React dans la carte
  name: string
  type: ExerciseType | null // null = type inconnu → pastille grise
  setCount: number
}

export type RoutinePreview = {
  id: string
  name: string
  exercises: RoutinePreviewExercise[]
}

export function toRoutinePreview(
  routine: Pick<Routine, 'id' | 'name' | 'exercisesData'>,
  exercisesById: ReadonlyMap<string, CatalogExercise>,
): RoutinePreview {
  return {
    id: routine.id,
    name: routine.name,
    exercises: routine.exercisesData.map(exerciseData => {
      const catalogExercise = exercisesById.get(exerciseData.exerciseId)
      if (catalogExercise === undefined) {
        return {
          exerciseId: exerciseData.exerciseId,
          name: exerciseData.exerciseId, // fallback : l'id brut
          type: null,
          setCount: exerciseData.targetSets.length,
        }
      }
      return {
        exerciseId: exerciseData.exerciseId,
        name: catalogExercise.name,
        type:
          catalogExercise.primaryMuscle === null || catalogExercise.category === null
            ? null
            : getExerciseType(catalogExercise.primaryMuscle, catalogExercise.category),
        setCount: exerciseData.targetSets.length, //nombre de séries cibles
      }
    }),
  }
}
