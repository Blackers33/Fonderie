import { and, eq, isNull } from 'drizzle-orm'
import * as Crypto from 'expo-crypto'
import { db } from '@/lib/db/client'
import { performedSets, routines, workouts } from '@/lib/db/schema'
import { toPerformedSets } from '@/lib/performed-sets'

// Renvoie l'id de la séance à ouvrir : celle en cours s'il y en a une,
// sinon une nouvelle, copiée depuis la routine
export function startWorkout(userId: string, routineId: string): string {
  const inProgress = db
    .select({ id: workouts.id })
    .from(workouts)
    .where(and(eq(workouts.userId, userId), isNull(workouts.finishedAt)))
    .get()
  if (inProgress) return inProgress.id

  const workoutId = Crypto.randomUUID()
  const now = Date.now()
  const routine = db
    .select()
    .from(routines)
    .where(and(eq(routines.id, routineId), eq(routines.userId, userId)))
    .get()
  if (!routine) throw new Error('Routine not found')

  // Tout ou rien : jamais une séance en cours sans ses séries
  db.transaction(tx => {
    tx.insert(workouts)
      .values({
        id: workoutId,
        userId,
        routineId: routine.id,
        name: routine.name,
        startedAt: now,
        createdAt: now,
        updatedAt: now,
      })
      .run()
    tx.insert(performedSets)
      .values(toPerformedSets(workoutId, routine.exercisesData, () => Crypto.randomUUID()))
      .run()
  })

  return workoutId
}
