import { and, asc, eq } from 'drizzle-orm'
import { useLiveQuery } from 'drizzle-orm/expo-sqlite'
import { db } from '@/lib/db/client'
import { exercises, performedSets, workouts } from '@/lib/db/schema'
import { toWorkoutSections } from '@/lib/workout-sections'

// Séance prête à afficher, mise à jour à chaque écriture dans sa table
export function useWorkout(userId: string, workoutId: string) {
  const workoutQuery = useLiveQuery(
    db
      .select({ name: workouts.name })
      .from(workouts)
      .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId))),
    [userId, workoutId],
  )

  const setsQuery = useLiveQuery(
    db
      .select({
        id: performedSets.id,
        exerciseId: performedSets.exerciseId,
        exerciseName: exercises.name,
        exerciseOrder: performedSets.exerciseOrder,
        reps: performedSets.reps,
        weight: performedSets.weight,
        completed: performedSets.completed,
      })
      .from(performedSets)
      .leftJoin(exercises, eq(exercises.id, performedSets.exerciseId))
      .where(eq(performedSets.workoutId, workoutId))
      .orderBy(asc(performedSets.exerciseOrder), asc(performedSets.setOrder)),
    [workoutId],
  )

  return {
    name: workoutQuery.data[0]?.name, // undefined tant que SQLite n'a pas répondu
    sections: toWorkoutSections(setsQuery.data),
  }
}
