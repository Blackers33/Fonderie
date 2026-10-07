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
L'envoi des données d'un User depuis l'appareil vers le serveur.
_Avoid_: sync, sauvegarde cloud

**Restore**:
La récupération, sur un appareil, des données d'un Account depuis le serveur, lors de la connexion.
_Avoid_: sync, import

**Catalog Sync**:
La mise à jour de la copie locale du catalogue d'exercices depuis le serveur.
_Avoid_: sync (seul), import

**Exercise Type**
la catégorie d'un exercice affichée à l'utilisateur : un regroupement de muscles, ou Cardio