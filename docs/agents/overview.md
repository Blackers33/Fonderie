# Fonderie : vue d'ensemble

App mobile de musculation centrée sur la surcharge progressive. MVP : créer et suivre un programme d'entraînement (routine → séance).

## Stack

Expo (React Native) + NestJS + Turso (libSQL) + Drizzle, en TypeScript, dans un monorepo pnpm : une installation s'écrit `pnpm add --filter <package>` (`-w` pour la racine).

## Principes transverses

- **Local-first** : sur l'appareil, le SQLite local est la source de vérité des données du User. Les échanges avec le serveur se limitent au Backup, au Restore et au Catalog Sync.
- **Privacy by Design** : données strictement isolées par User, aucune API de santé tierce. La seule fonction communautaire prévue est le partage de routines.
- **Sécurité** : conformité OWASP Mobile Top 10.
- **Performance mobile** : surveille la mémoire, limite les re-renders, garde les animations fluides.
