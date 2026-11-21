# Identité (mobile)

## Lazy Registration

On entre dans l'app en Guest ou en créant un Account. Le `userId` est un UUID généré sur l'appareil (au choix de Guest, ou juste avant l'inscription) et sert partout. Un Account reprend ce même UUID comme `users.id` côté serveur : aucun remapping.

Pas encore implémenté (prévu depuis Settings) :
- un Guest qui crée un Account (aujourd'hui, `sign-up` n'est accessible que sans identité) ;
- un Guest qui se connecte à un Account existant : ses données locales seront remappées vers l'id de l'Account.

## Identité locale

`{ userId, accessToken | null }` (`null` = Guest), stockée en une seule clé JSON dans `expo-secure-store` pour une écriture atomique. Accès par `useIdentity()` (`apps/mobile/lib/auth/identity-context.tsx`).

- **Routage déclaratif** : `Stack.Protected` dans `apps/mobile/app/_layout.tsx` choisit les écrans selon l'identité. Après un changement d'identité, `updateIdentity` suffit : le routage suit tout seul, sans `router.replace`.
- **Persister avant le state** : `updateIdentity` écrit dans SecureStore avant de mettre à jour le state ; dans l'autre ordre, un échec d'écriture laisse une session fantôme et des données orphelines.
- **Réinstallation iOS** : le Keychain survit à la désinstallation. Un marqueur `hasLaunchedBefore` dans `expo-sqlite/kv-store` (effacé, lui) détecte le premier lancement d'une installation : on vide SecureStore *avant* d'écrire le marqueur (règle pure : `resolveStartupIdentity`).
- **Token expiré** : il ne bloque jamais l'accès aux données locales ; l'Account ne sert qu'au Backup.

## Outil de dev

Menu dev d'Expo → « Reset identity » : efface l'identité seule, les données SQLite restent orphelines.
