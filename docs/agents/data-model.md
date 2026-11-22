# Modèle de données

Source de vérité : `apps/api/src/db/schema.ts` (Turso) et `apps/mobile/lib/db/schema.ts` (SQLite local). Les deux restent conceptuellement identiques, à deux différences près : `users` n'existe que côté serveur, et `lastUploadedAt` n'existe que côté mobile (il pilote le Backup).

## Routines et programmes : JSON dénormalisé

Une routine embarque ses exercices et leurs séries cibles dans un seul champ JSON, `routines.exercisesData` (type `RoutineExerciseData[]`, défini une fois dans `packages/shared-utils/src/workout-types.ts` et importé des deux côtés). Pourquoi : sans synchro bidirectionnelle, rien n'oblige à répliquer une structure relationnelle ligne par ligne.

- Les séries cibles (`targetSets`) sont saisies à la main ; une suggestion basée sur l'historique est prévue en V2.
- Un programme est un simple regroupement de routines (ex : Push/Pull/Legs) : une routine appartient à 0 ou 1 programme via `routines.programId`, sans ordre ni rotation automatique.

## Séances : table plate

Exception au JSON : les séries réalisées vivent dans `performed_sets`, une ligne par série, rattachée à `workouts`. Pourquoi : elles sont interrogées par exercice (historique, volume, pré-remplissage du dernier poids utilisé, cœur de la surcharge progressive), ce qu'un JSON non indexable rendrait impossible en SQL.

Au démarrage d'une séance depuis une routine, ses `targetSets` sont copiés en lignes `performed_sets` : copie indépendante, sans lien vivant vers la routine. `workouts.routineId` est nullable en prévision d'une séance libre, une fonctionnalité pas encore tranchée.

## Exercices : catalogue relationnel

`exercises` contient le catalogue global (`isCustom: false`, `ownerId: null`) et les Custom Exercises du User (`isCustom: true`, backupés comme le reste de ses données). `exercisesData` et `performed_sets` y renvoient par `exerciseId`, par convention (sans clé étrangère).

- `id` est un slug stable (`bench_press`) : clé de traduction (table `exercise_translations`, peuplée par le Catalog Sync) et nom du fichier image sur le CDN (post-MVP ; jamais d'image en blob dans la base).
- `name` est le libellé anglais, affiché quand une traduction manque.

## Modifier le schéma

1. Modifie les deux `schema.ts` ensemble (hors différences ci-dessus).
2. Lance `pnpm db:generate` dans `apps/api` et dans `apps/mobile` : il génère les `.sql` et leurs métadonnées dans `drizzle/`, à committer (c'est l'historique versionné du schéma). Côté mobile, il génère aussi `drizzle/migrations.js`, car Metro ne lit pas le filesystem au runtime.
3. Côté API, `pnpm db:migrate` applique les migrations sur Turso. Côté mobile, `useMigrations` (`apps/mobile/app/_layout.tsx`) les applique au démarrage et bloque le rendu tant qu'elles n'ont pas réussi.
