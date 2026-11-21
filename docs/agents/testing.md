# Tests

Vitest partout, mobile compris (pas `jest-expo`, que propose Expo par défaut).

## Conventions

- Fichiers `*.spec.ts`, à côté du fichier testé (`lib/exercise-types.ts` → `lib/exercise-types.spec.ts`). Exception : les e2e API, en `*.e2e-spec.ts` dans `apps/api/test/`.
- `pnpm test` (racine) passe par turbo, qui ignore sans erreur les packages sans script `test` : pour ajouter des tests à un package, il suffit de lui en donner un (`turbo.json` ne change pas).

## Périmètre

- **API** : la logique métier des services (ex : `AuthService`). La base est la seule frontière d'I/O à isoler : mocke le token `DB_CLIENT` à la main, avec une chaîne `mockReturnThis()` qui reproduit l'API fluide de Drizzle (modèle : `apps/api/src/auth/auth.service.spec.ts`).
- **Mobile** : uniquement les fonctions pures de `lib/`. Écrans et composants ne sont pas testés (pas de React Native Testing Library), par choix de simplicité.
- **`packages/shared-utils`** : pas encore de tests ni de script `test`. Ils deviennent prioritaires dès qu'une vraie fonction pure y arrive : un bug y touche à la fois l'API et le mobile.
