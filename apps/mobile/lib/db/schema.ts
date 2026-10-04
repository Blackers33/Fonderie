import type { RoutineExerciseData } from '@workspace/shared-utils'
import {
  CATEGORIES,
  EQUIPMENT,
  FORCES,
  LEVELS,
  LOCALES,
  MECHANICS,
  MUSCLES,
} from '@workspace/shared-utils'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

// Table à ligne unique (id toujours = 1) : l'état local de l'app.
// Purement mobile, jamais backupée — le serveur a sa propre table `users`.
export const appState = sqliteTable('app_state', {
  id: integer('id').primaryKey(),
  // UUID généré au premier lancement en mode Invité.
  // Devient l'id du compte serveur à l'inscription (pas de remapping de FK).
  // Écrasé par l'id du compte lors d'un login sur une install vierge.
  userId: text('user_id').notNull(),
})

export const exercises = sqliteTable('exercises', {
  // slug stable, ex: 'bench_press' — sert aussi de nom de fichier image sur le CDN
  id: text('id').primaryKey(),
  // libellé anglais, fallback si une traduction manque
  name: text('name').notNull(),

  primaryMuscle: text('primary_muscle', { enum: [...MUSCLES] }),
  equipment: text('equipment', { enum: [...EQUIPMENT] }),
  category: text('category', { enum: [...CATEGORIES] }),
  level: text('level', { enum: [...LEVELS] }),
  force: text('force', { enum: [...FORCES] }),
  mechanic: text('mechanic', { enum: [...MECHANICS] }),

  isCustom: integer('is_custom', { mode: 'boolean' }).notNull().default(false),
  ownerId: text('owner_id'), // null si global

  updatedAt: integer('updated_at').notNull(),
})

export const exerciseTranslations = sqliteTable('exercise_translations', {
  id: text('id').primaryKey(),
  exerciseId: text('exercise_id').notNull(), // référence exercises.id par convention
  locale: text('locale', { enum: [...LOCALES] }).notNull(),
  name: text('name').notNull(),
})

export const programs = sqliteTable('programs', {
  id: text('id').primaryKey(), // uuid généré côté client
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
  lastUploadedAt: integer('last_uploaded_at'), // null tant que jamais backupée
})

export const routines = sqliteTable('routines', {
  id: text('id').primaryKey(), // uuid généré côté client
  userId: text('user_id').notNull(),
  programId: text('program_id'),
  name: text('name').notNull(),
  exercisesData: text('exercises_data', { mode: 'json' }).notNull().$type<RoutineExerciseData[]>(),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
  lastUploadedAt: integer('last_uploaded_at'), // null tant que jamais backupée
})

export const workouts = sqliteTable('workouts', {
  id: text('id').primaryKey(), // uuid généré côté client
  userId: text('user_id').notNull(),
  routineId: text('routine_id'), // nullable: séance libre possible
  name: text('name').notNull(),
  startedAt: integer('started_at').notNull(),
  finishedAt: integer('finished_at'), // null tant que la séance est en cours
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
  lastUploadedAt: integer('last_uploaded_at'), // null tant que jamais backupée
})

export const performedSets = sqliteTable('performed_sets', {
  id: text('id').primaryKey(),
  workoutId: text('workout_id').notNull(),
  exerciseId: text('exercise_id').notNull(),
  exerciseOrder: integer('exercise_order').notNull(),
  setOrder: integer('set_order').notNull(),
  reps: integer('reps').notNull(),
  weight: integer('weight').notNull(),
  completed: integer('completed', { mode: 'boolean' }).notNull(),
})
