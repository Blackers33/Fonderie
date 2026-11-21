# Catalog Sync (Turso → mobile)

Met à jour la copie locale du catalogue d'exercices global et de ses traductions (`exercise_translations`). Sens inverse du Backup, et limité à ce référentiel : jamais de données du User.

**Statut** : pas implémenté (issue #65). En attendant, un seed de démo (`apps/mobile/lib/dev/demo-seed.ts`) insère un export JSON du catalogue, produit par `pnpm catalog:export` dans `apps/api`.

## Décisions

- **Recherche** : toujours 100 % offline sur la copie locale, jamais d'appel API à la frappe.
- **Pull complet** : « wipe & replace » des exercices globaux (`isCustom = false`) ; les Custom Exercises ne sont jamais touchés. Pas d'incrémental : le catalogue est petit (~1000 lignes) et change rarement.
- **Déclenchement** : lazy, à l'entrée du flow créer/modifier une routine (un User qui ne l'ouvre jamais ne déclenche aucun pull), avec un TTL pour ne pas re-pull à chaque ouverture.
- **Premier pull sans réseau** (aucune donnée locale) : un état vide explicite invite à se connecter à internet, avec un bouton retry.
