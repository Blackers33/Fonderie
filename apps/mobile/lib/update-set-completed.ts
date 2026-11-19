import { eq } from 'drizzle-orm'
import { db } from '@/lib/db/client'
import { performedSets } from '@/lib/db/schema'

// Enregistré tout de suite : une séance interrompue garde ses séries cochées
export function updateSetCompleted(setId: string, completed: boolean) {
  db.update(performedSets).set({ completed }).where(eq(performedSets.id, setId)).run()
}
