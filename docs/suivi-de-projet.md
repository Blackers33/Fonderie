# Suivi de projet

## Méthode : Kanban + jalons

Flux continu, sans sprint : le rythme de travail est irrégulier (de plusieurs heures
par jour à plusieurs semaines sans activité), des itérations à durée fixe n'auraient
pas de sens. Le planning repose sur des **jalons** définis par une capacité
démontrable (« on peut faire une séance complète »), chacun avec une date cible
révisable. La clôture d'un jalon est le point de validation : voir
[Definition of Done](definition-of-done.md#jalon).

**Limite de WIP : 2** issues « En cours » au maximum, stories et technique confondues.

## Rôle des outils

| Outil | Contient |
|---|---|
| GitHub Project | Le kanban de toutes les issues |
| Issues `story` | La valeur utilisateur (« En tant que… ») |
| Autres issues | Le travail technique : dette, bugs, tâches |
| `CLAUDE.md` | Le fonctionnement du projet |
| `GLOSSARY.md` | Le vocabulaire du domaine |
| `docs/adr/` | Le pourquoi des grandes décisions |

Une information n'est écrite qu'à un seul endroit ; les autres y renvoient.


## Structure GitHub

- **Identifiant** : le numéro d'issue.
- **Epics** : 7 issues `epic`, dont les stories sont des sous-issues.
- **Jalons** : Milestones J1 à J5, créés sans date.
- **MoSCoW** : labels, l'horizon étant la version jury.
- **Labels** : `story`, `epic`, `bug`, `tech-debt`, `security`, `must`, `should`, `could`, `wont`, `blocker-release`.
- **Colonnes** : Backlog / En cours / Terminé.
- **Champ** : « Estimation (j/h) ».
- **Vues** : Stories, Technique, Epics, Won't.
- **Stories `wont`** : elles restent ouvertes.

### Organisation des issues

- **Epic** : une issue `epic` par grand ensemble fonctionnel ; ses stories en sont
  les sous-issues (la barre de progression donne l'avancement par lot).
- **Story** : créée avec le modèle `story`. Rôles : uniquement User ou Guest
  (cf. glossaire). Les stories `must` et `should` ont leurs scénarios Gherkin
  complets ; les `could` et `wont` seulement leur phrase « En tant que… ».
- **Technique** : rattachée en sous-issue à la story qu'elle sert, sinon autonome.
- **Bug** : créé avec le modèle `bug`.

### Labels

| Label | Sens |
|---|---|
| `story`, `epic` | Type d'issue |
| `bug`, `tech-debt`, `security` | Type de travail technique |
| `must`, `should`, `could`, `wont` | Priorité MoSCoW, jugée par rapport à la version présentée au jury |
| `blocker-release` | Bloquant pour la publication sur les stores (horizon distinct du jury) |

Un changement de priorité se fait en changeant le label : l'historique de l'issue
garde la trace datée de l'arbitrage. Les stories `wont` restent ouvertes.

### Colonnes

Backlog → En cours → Terminé. Une story passe en « Terminé » quand elle respecte
la [Definition of Done](definition-of-done.md#story).

### Jalons

Contenu, date cible et vérification iOS : voir la description de chaque
[Milestone](https://github.com/Blackers33/Fonderie/milestones).

### Estimation

- Charge estimée par story, champ « Estimation (j/h) » du Project.
- 1 j/h = 6 h de travail concentré. Échelle : 0,5 · 1 · 2 · 3 · 5.
  Au-delà de 5, la story est découpée.
- Date d'un jalon ≈ somme des charges ÷ capacité moyenne, plus une marge.
- Hypothèse de capacité : 15 h/mois (2,5 j/h). Recalée à chaque clôture de jalon,
  en comparant date prévue et date réelle.

### Format d'une story

- Un modèle Markdown : En tant que… / scénarios Gherkin cochables / Hors périmètre / Notes techniques / lien **absolu** vers la DoD.
- Les rôles sont uniquement User et Guest.
- Les `could` et les `wont` n'ont qu'une phrase. Les `must` et les `should` sont entièrement détaillées.
- Un modèle `bug` en 6 sections.

**Inventaire** : 43 stories, dont 22 `must`/`should` encore à faire, et 3 livrées en J1.



## Décisions produit prises au passage


- Pas d'unicité des noms de routine.
- Poids ≥ 0 en kg, virgule ou point acceptés.
- Une nouvelle série a reps et poids vides et un repos de `0:00`.
- Une seule séance en cours à la fois, reprise via un bandeau.
- Performances précédentes par exercice, en lecture seule.
- Les suppressions survivent au Restore.
- Le Backup n'envoie que les séances terminées ; le Restore n'a lieu qu'à la connexion.
- Déconnexion et suppression d'Account effacent l'appareil.
- Catalogue public, recherche insensible aux accents et bilingue.
- Exercice custom : nom et type obligatoires.
- L'onglet Explorer devient l'onglet Historique.