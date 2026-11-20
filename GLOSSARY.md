# Fonderie

Application mobile de suivi de musculation centrée sur la surcharge progressive, local-first.

## Language

### Identité

**User**:
La personne qui utilise l'app, identifiée par un UUID généré sur l'appareil au moment où elle entre dans l'app (en Guest ou en créant un Account).
_Avoid_: utilisateur invité, profil


**Guest**:
Un User qui n'a pas d'Account.
_Avoid_: anonyme, utilisateur non connecté

**Account**:
Les identifiants (email + mot de passe) rattachés à un User côté serveur. Créer un Account promeut un User existant, il n'en crée pas de nouveau.
_Avoid_: compte utilisateur, inscription, profil

### Données

**Backup**:
L'envoi automatique des données d'un User qui a un Account, depuis l'appareil vers le serveur. Un Active Workout n'est jamais envoyé.
_Avoid_: sync, sauvegarde cloud

**Restore**:
La récupération, sur un appareil, des données d'un Account depuis le serveur, lors de la connexion.
_Avoid_: sync, import

**Merge**:
La réunion des données d'un Guest avec celles d'un Account existant, quand ce Guest se connecte à cet Account. Rien n'est écrasé : les deux ensembles coexistent.
_Avoid_: fusion, réattribution, remapping

**Catalog Sync**:
La mise à jour de la copie locale du Catalog depuis le serveur. Elle ne touche jamais aux Custom Exercises.
_Avoid_: sync (seul), import

**Delete**:
Retirer définitivement une donnée d'un User (Routine, Workout terminé, Custom Exercise), sur tous ses appareils.
_Avoid_: effacer, retirer

### Entraînement

**Exercise**:
Un mouvement d'entraînement identifié (ex. développé couché), issu du Catalog ou Custom Exercise.
_Avoid_: mouvement

**Catalog**:
L'ensemble des Exercises globaux, maintenus par Fonderie et identiques pour tous les Users.
_Avoid_: référentiel, base d'exercices, bibliothèque

**Custom Exercise**:
Un Exercise créé par un User, qui n'appartient qu'à lui et ne fait pas partie du Catalog.
_Avoid_: exercice perso, exercice utilisateur

**Exercise Type**:
Le groupe d'un Exercise montré au User : un groupe musculaire (pectoraux, dos, épaules, bras, jambes, abdominaux) ou cardio.
_Avoid_: catégorie

**Program**:
Un regroupement nommé de Routines pensées comme un tout (ex. Push/Pull/Legs). Une Routine appartient à au plus un Program.
_Avoid_: plan, split, cycle

**Routine**:
Un modèle de séance défini par un User : une liste ordonnée d'Exercises, chacun avec ses Target Sets.
_Avoid_: template, plan, séance type

**Target Set**:
Une série prévue dans une Routine pour un Exercise : reps, charge et temps de Rest.
_Avoid_: série cible, objectif

**Workout**:
Une séance d'entraînement effectuée par un User, démarrée depuis une Routine ou libre (sans Routine). Démarré depuis une Routine, il en reçoit une copie indépendante des Target Sets.
_Avoid_: session, séance, training

**Active Workout**:
Un Workout démarré et pas encore terminé. Un User en a au plus un.
_Avoid_: séance en cours, current workout, workout ouvert

**Set**:
Une série d'un Workout : reps, charge et temps de Rest. Elle est **completed** une fois cochée par le User ; seul un Set completed compte comme réellement fait.
_Avoid_: performed set, série réalisée

**Rest**:
La pause qui suit un Set completed, d'une durée fixée par ce Set.
_Avoid_: repos, récupération, pause

**Finish**:
Mettre fin à un Active Workout qui a au moins un Set completed ; il entre dans l'History.
_Avoid_: terminer, valider, clôturer

**Abandon**:
Mettre fin à un Active Workout dont aucun Set n'est completed : il disparaît sans laisser de trace. Finir un tel Workout revient toujours à l'abandonner.
_Avoid_: annuler, supprimer

**History**:
L'ensemble des Workouts terminés d'un User.
_Avoid_: journal, log, historique

### Progression

**Progressive Overload**:
Le principe d'augmenter progressivement la charge ou les reps d'un Exercise d'un Workout à l'autre, pour continuer à progresser.
_Avoid_: progression, surcharge

**Previous Performance**:
Pour un Exercise et un numéro de Set donnés, le dernier Set completed correspondant, tous Workouts confondus.
_Avoid_: dernière fois, record
