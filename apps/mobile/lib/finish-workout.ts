import { eq } from 'drizzle-orm'
import { db } from '@/lib/db/client'
import { workouts } from '@/lib/db/schema'

// Une séance terminée n'est plus « en cours » : le prochain « Démarrer » en créera une nouvelle
export function finishWorkout(workoutId: string) {
  const now = Date.now()
  db.update(workouts)
    .set({ finishedAt: now, updatedAt: now })
    .where(eq(workouts.id, workoutId))
    .run()
}
