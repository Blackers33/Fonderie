// apps/mobile/lib/routine-preview.spec.ts
import { describe, expect, it } from 'vitest'
import { type CatalogExercise, toRoutinePreview } from './routine-preview'

describe('toRoutinePreview', () => {
  it('joins each exercise with the catalog, computes its type and counts its sets', () => {
    // Une routine réduite au strict nécessaire : 1 exercice, 2 séries
    const routine = {
      id: 'push',
      name: 'Push Day',
      exercisesData: [
        {
          exerciseId: 'barbell_bench_press_medium_grip',
          order: 0,
          targetSets: [
            { order: 0, reps: 8, weight: 60, restSeconds: 20 },
            { order: 1, reps: 8, weight: 60, restSeconds: 20 },
          ],
        },
      ],
    }
    // <string, CatalogExercise> : sans ça, TS déduirait primaryMuscle: string (et pas Muscle)
    const exercisesById = new Map<string, CatalogExercise>([
      [
        'barbell_bench_press_medium_grip',
        { name: 'Barbell Bench Press - Medium Grip', primaryMuscle: 'chest', category: 'strength' },
      ],
    ])

    expect(toRoutinePreview(routine, exercisesById)).toEqual({
      id: 'push',
      name: 'Push Day',
      exercises: [
        {
          exerciseId: 'barbell_bench_press_medium_grip',
          name: 'Barbell Bench Press - Medium Grip', // vient du catalogue, pas de la routine
          type: 'chest', // valeur écrite en dur, pas recalculée
          setCount: 2, // = nombre de targetSets
        },
      ],
    })
  })
  it('falls back to the exercise id and a null type when the exercise is missing from the catalog', () => {
    const routine = {
      id: 'push',
      name: 'Push Day',
      exercisesData: [
        {
          exerciseId: 'unknown_exercise', // absent du Map ci-dessous
          order: 0,
          targetSets: [{ order: 0, reps: 8, weight: 60, restSeconds: 20 }],
        },
      ],
    }
    const exercisesById = new Map<string, CatalogExercise>() // catalogue vide

    expect(toRoutinePreview(routine, exercisesById).exercises).toEqual([
      {
        exerciseId: 'unknown_exercise',
        name: 'unknown_exercise', // fallback : l'id brut
        type: null, // type inconnu → pastille grise
        setCount: 1, // les séries, elles, sont connues (elles viennent de la routine)
      },
    ])
  })
  it('returns a null type when the catalog exercise has no muscle or no category', () => {
    const routine = {
      id: 'push',
      name: 'Push Day',
      exercisesData: [
        {
          exerciseId: 'no_muscle',
          order: 0,
          targetSets: [{ order: 0, reps: 8, weight: 60, restSeconds: 20 }],
        },
        {
          exerciseId: 'no_category',
          order: 1,
          targetSets: [{ order: 0, reps: 8, weight: 60, restSeconds: 20 }],
        },
      ],
    }
    const exercisesById = new Map<string, CatalogExercise>([
      ['no_muscle', { name: 'No Muscle', primaryMuscle: null, category: 'strength' }],
      ['no_category', { name: 'No Category', primaryMuscle: 'chest', category: null }],
    ])

    expect(toRoutinePreview(routine, exercisesById).exercises).toEqual([
      // Trouvés dans le catalogue → vrai nom, mais type impossible à déduire
      { exerciseId: 'no_muscle', name: 'No Muscle', type: null, setCount: 1 },
      { exerciseId: 'no_category', name: 'No Category', type: null, setCount: 1 },
    ])
  })
})
