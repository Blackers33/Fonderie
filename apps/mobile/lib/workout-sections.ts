// Une série de la séance, avec le nom de son exercice (jointure SQL)
export type WorkoutSetRow = {
  id: string
  exerciseId: string
  exerciseName: string | null // null si l'exercice manque au catalogue
  exerciseOrder: number
  reps: number
  weight: number
  completed: boolean
}

// Forme attendue par SectionList : un titre et ses lignes
export type WorkoutSection = {
  title: string
  data: WorkoutSetRow[]
}

// Regroupe les séries par exercice.
// Les lignes arrivent triées par exerciseOrder, puis setOrder.
export function toWorkoutSections(rows: WorkoutSetRow[]): WorkoutSection[] {
  const sections: WorkoutSection[] = []
  rows.forEach((row, index) => {
    const isNewExercise = index === 0 || row.exerciseOrder !== rows[index - 1].exerciseOrder
    if (isNewExercise) {
      sections.push({ title: row.exerciseName ?? row.exerciseId, data: [row] })
    } else {
      sections[sections.length - 1].data.push(row)
    }
  })
  return sections
}
