import { describe, expect, it } from 'vitest'
import { toWorkoutSections } from './workout-sections'

describe('toWorkoutSections', () => {
  it('groups the sets of one exercise under its name', () => {
    const rows = [
      {
        id: 's1',
        exerciseId: 'bench_press',
        exerciseName: 'Bench Press',
        exerciseOrder: 0,
        reps: 8,
        weight: 60,
        completed: false,
      },
      {
        id: 's2',
        exerciseId: 'bench_press',
        exerciseName: 'Bench Press',
        exerciseOrder: 0,
        reps: 6,
        weight: 62.5,
        completed: false,
      },
    ]

    expect(toWorkoutSections(rows)).toEqual([{ title: 'Bench Press', data: rows }])
  })
  it('keeps an exercise repeated in the routine as two sections', () => {
    // Même exercice, deux places dans la routine : lourd, puis léger
    const rows = [
      {
        id: 's1',
        exerciseId: 'bench_press',
        exerciseName: 'Bench Press',
        exerciseOrder: 0,
        reps: 5,
        weight: 80,
        completed: false,
      },
      {
        id: 's2',
        exerciseId: 'bench_press',
        exerciseName: 'Bench Press',
        exerciseOrder: 1,
        reps: 12,
        weight: 50,
        completed: false,
      },
    ]

    expect(toWorkoutSections(rows)).toEqual([
      { title: 'Bench Press', data: [rows[0]] },
      { title: 'Bench Press', data: [rows[1]] },
    ])
  })
  it('falls back to the exercise id when the name is missing', () => {
    const rows = [
      {
        id: 's1',
        exerciseId: 'custom_curl',
        exerciseName: null,
        exerciseOrder: 0,
        reps: 10,
        weight: 15,
        completed: false,
      },
    ]

    expect(toWorkoutSections(rows)).toEqual([{ title: 'custom_curl', data: rows }])
  })
})
