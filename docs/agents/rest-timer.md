# Minuteur de repos (module natif `rest-timer`)

Module Expo local `apps/mobile/modules/rest-timer`, Android uniquement : un service au premier plan (`specialUse`) qui vit le temps d'un repos, affiche le décompte en notification et poste l'alerte de fin, écran éteint compris.

- **Point d'entrée JS** : `startRest` / `stopRest` (`apps/mobile/lib/notifications/rest-timer-notifications.ts`). Ils créent les deux canaux de notification (sans eux, `startForeground` plante), passent les textes déjà traduits (le natif n'a pas accès à i18next) et ne font rien hors Android.
- **Fin du repos** : `Handler.postDelayed` + wake lock partiel tenus par le service. Une alarme ne convient pas : `setExact` est différé par Doze, et `setExactAndAllowWhileIdle` exige `SCHEDULE_EXACT_ALARM`, refusée par défaut. Mesures et méthode : issue #75.
- **iOS** : non implémenté (`ios/RestTimerModule.swift` est resté le modèle généré).
- **Après une modif native** : recompiler, voir `docs/agents/mobile.md`.
