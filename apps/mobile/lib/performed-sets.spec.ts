import { describe, expect, it } from 'vitest'
import { toPerformedSets } from './performed-sets'

describe('toPerformedSets', () => {
  it('copies a target set into a performed set, not completed', () => {
    const exercisesData = [
      {
        exerciseId: 'barbell_bench_press_medium_grip',
        order: 0,
        targetSets: [{ order: 0, reps: 8, weight: 22.5, restSeconds: 90 }],
      },
    ]

    expect(toPerformedSets('workout-1', exercisesData, () => 'set-1')).toEqual([
      {
        id: 'set-1',
        workoutId: 'workout-1',
        exerciseId: 'barbell_bench_press_medium_grip',
        exerciseOrder: 0,
        setOrder: 0,
        reps: 8,
        weight: 22.5,
        restSeconds: 90,
        completed: false,
      },
    ])
  })
  it('flattens every set of every exercise, in order, each with its own id', () => {
    const exercisesData = [
      {
        exerciseId: 'bench_press',
        order: 0,
        targetSets: [
          { order: 0, reps: 8, weight: 60, restSeconds: 90 },
          { order: 1, reps: 6, weight: 62.5, restSeconds: 90 },
        ],
      },
      {
        exerciseId: 'overhead_press',
        order: 1,
        targetSets: [{ order: 0, reps: 10, weight: 30, restSeconds: 60 }],
      },
    ]
    // Générateur d'ids prévisible : set-1, set-2, set-3…
    let count = 0
    const newId = () => `set-${++count}`

    expect(toPerformedSets('workout-1', exercisesData, newId)).toMatchObject([
      { id: 'set-1', exerciseId: 'bench_press', exerciseOrder: 0, setOrder: 0 },
      { id: 'set-2', exerciseId: 'bench_press', exerciseOrder: 0, setOrder: 1 },
      { id: 'set-3', exerciseId: 'overhead_press', exerciseOrder: 1, setOrder: 0 },
    ])
  })
})
