# Backup et Restore

**Statut** : ni l'un ni l'autre n'est implémenté. Le module Auth (JWT) existe côté API ; il manque les endpoints de Backup.

## Backup (appareil → Turso)

Seul un Account fait un Backup : un Guest n'envoie jamais rien au serveur.

- **Déclenchement** : automatique et silencieux, en fin de séance et à chaque modification de routine.
- **Lignes à uploader** : celles dont `updatedAt > lastUploadedAt` (colonne mobile uniquement, sur `programs`, `routines` et `workouts` ; null tant que la ligne n'a jamais été backupée).
- **Séances** : une séance terminée n'est quasiment jamais modifiée, donc le Backup envoie une ligne `workouts` avec tout son lot de `performed_sets` d'un bloc ; `performed_sets` n'a pas de `lastUploadedAt`.
- **Conflits** : aucune résolution, le dernier écrit gagne. Jamais de synchro bidirectionnelle sur une même table.

## Restore (Turso → appareil)

Le pendant du Backup : à la connexion à un Account, l'appareil récupère ses données depuis le serveur.

## Points ouverts

- Custom Exercises : à backuper comme le reste, mais `exercises` n'a pas de `lastUploadedAt`, donc rien ne permet encore de savoir lesquels uploader.
