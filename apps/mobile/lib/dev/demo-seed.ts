import type { RoutineExerciseData, TargetSet } from '@workspace/shared-utils'
import { db } from '@/lib/db/client'
import { exercises, routines } from '@/lib/db/schema'

// SEED DE DÉMO TEMPORAIRE (label `tp`) : à supprimer quand #65 et #34 seront faits.
// La liste de tout ce qu'il faut retirer (mobile + script API) est dans #76.

// Construit `count` séries identiques, pour ne pas recopier le même objet à la main
function sets(count: number, reps: number, weight: number, restSeconds: number): TargetSet[] {
  return Array.from({ length: count }, (_, index) => ({ order: index, reps, weight, restSeconds }))
}

// Numérote les exercices selon leur position dans la routine
function withOrder(list: Omit<RoutineExerciseData, 'order'>[]): RoutineExerciseData[] {
  return list.map((exercise, index) => ({ ...exercise, order: index }))
}

// Ids FIXES : c'est ce qui rend le seed idempotent (une 2ᵉ exécution retombe sur les mêmes lignes)
const DEMO_ROUTINES = [
  {
    id: '40fae343-3a47-4c90-938e-bb594f91e065',
    name: 'Push Day',
    // Repos courts (20 s) : routine prévue pour la démo de la notif de fin de repos
    exercisesData: withOrder([
      { exerciseId: 'barbell_bench_press_medium_grip', targetSets: sets(3, 8, 60, 20) },
      { exerciseId: 'standing_military_press', targetSets: sets(3, 8, 40, 20) },
      { exerciseId: 'incline_dumbbell_press', targetSets: sets(3, 10, 22.5, 20) },
      { exerciseId: 'side_lateral_raise', targetSets: sets(3, 12, 8, 20) },
      { exerciseId: 'triceps_pushdown', targetSets: sets(3, 12, 25, 20) },
    ]),
  },
  {
    id: '999531e1-e796-4dcf-9e94-15b5d2f37348',
    name: 'Pull Day',
    exercisesData: withOrder([
      { exerciseId: 'barbell_deadlift', targetSets: sets(3, 5, 100, 180) },
      { exerciseId: 'pullups', targetSets: sets(3, 8, 0, 120) }, // 0 kg = poids du corps
      { exerciseId: 'bent_over_barbell_row', targetSets: sets(3, 8, 60, 90) },
      { exerciseId: 'dumbbell_bicep_curl', targetSets: sets(3, 12, 12, 60) },
    ]),
  },
  {
    id: 'd9002d1f-bd30-4732-abd8-abe5b9e57004',
    name: 'Leg Day',
    exercisesData: withOrder([
      { exerciseId: 'barbell_squat', targetSets: sets(4, 6, 80, 150) },
      { exerciseId: 'romanian_deadlift', targetSets: sets(3, 8, 70, 120) },
      { exerciseId: 'leg_press', targetSets: sets(3, 10, 120, 90) },
      { exerciseId: 'standing_calf_raises', targetSets: sets(4, 15, 40, 60) },
    ]),
  },
] satisfies { id: string; name: string; exercisesData: RoutineExerciseData[] }[]

export async function seedDemoData(userId: string) {
  // Import dynamique : le JSON n'est chargé que si on lance le seed, pas au démarrage de l'app
  const { default: catalog } = await import('@/assets/seed/exercises.json')
  const now = Date.now()

  // Tout ou rien : jamais une base à moitié seedée
  db.transaction(tx => {
    tx.insert(exercises)
      // TS type les champs du JSON en `string`, pas avec les unions du schéma (Muscle…).
      // Le cast est sûr : le fichier est généré depuis une table au schéma identique.
      .values(catalog as (typeof exercises.$inferInsert)[])
      .onConflictDoNothing() // le catalogue n'appartient à personne : rien à mettre à jour
      .run()

    tx.insert(routines)
      .values(
        DEMO_ROUTINES.map(routine => ({ ...routine, userId, createdAt: now, updatedAt: now })),
      )
      // Conflit sur l'id = routine déjà seedée, peut-être pour une autre identité :
      // on la réattribue à l'utilisateur courant (option (a))
      .onConflictDoUpdate({ target: routines.id, set: { userId, updatedAt: now } })
      .run()
  })
}
