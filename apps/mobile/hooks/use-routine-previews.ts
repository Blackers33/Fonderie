import { asc, eq, inArray } from 'drizzle-orm'
import { useLiveQuery } from 'drizzle-orm/expo-sqlite'
import { db } from '@/lib/db/client'
import { exercises, routines } from '@/lib/db/schema'
import { toRoutinePreview } from '@/lib/routine-preview'

// Routines de l'utilisateur, prêtes à afficher, mises à jour automatiquement
// à chaque écriture dans `routines` ou `exercises` (enableChangeListener).
export function useRoutinePreviews(userId: string) {
  //Routines de l'utilisateur, ordre de création
  const routinesQuery = useLiveQuery(
    db.select().from(routines).where(eq(routines.userId, userId)).orderBy(asc(routines.createdAt)),
    [userId], // nouvel utilisateur → nouvelle requête
  )

  //Ids d'exercices utilisés, sans doublon (Set), triés pour que la clé soit stable
  const exerciseIds = [
    ...new Set(routinesQuery.data.flatMap(routine => routine.exercisesData.map(e => e.exerciseId))),
  ].sort()
  // Clé TEXTE : comparée par contenu, contrairement au tableau (nouvelle boîte à chaque rendu)
  const exerciseIdsKey = exerciseIds.join(',')

  //Seulement les exercices utilisés, et seulement les colonnes utiles (mémoire)
  const exercisesQuery = useLiveQuery(
    db
      .select({
        id: exercises.id,
        name: exercises.name,
        primaryMuscle: exercises.primaryMuscle,
        category: exercises.category,
      })
      .from(exercises)
      .where(inArray(exercises.id, exerciseIds)), // [] → `WHERE false` → 0 ligne, pas de plantage
    [exerciseIdsKey],
  )

  //id → exercice, pour une recherche instantanée dans toRoutinePreview
  const exercisesById = new Map(exercisesQuery.data.map(exercise => [exercise.id, exercise]))

  //La jointure, via la fonction pure testée
  return {
    routines: routinesQuery.data.map(routine => toRoutinePreview(routine, exercisesById)),
    // updatedAt reste undefined tant que la 1ʳᵉ réponse n'est pas arrivée
    isLoaded: routinesQuery.updatedAt !== undefined,
  }
}
