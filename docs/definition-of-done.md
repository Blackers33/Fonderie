# Definition of Done

## Story
Une story passe en « Terminé » quand :

1. Tous ses scénarios sont cochés ; ce qui ne l'est pas figure dans « Hors périmètre ».
2. Elle est vérifiée sur un appareil Android physique.
3. i18n : aucun texte en dur ; clés présentes en FR et EN.
4. Accessibilité : éléments interactifs étiquetés pour TalkBack/VoiceOver,
   ordre de focus logique, contraste WCAG AA (4,5:1 pour le texte).
5. Sécurité : entrées validées côté serveur si un endpoint est concerné ;
   aucun secret ni donnée personnelle dans les logs.
6. Tests : la nouvelle logique pure est couverte par des tests unitaires ; `pnpm test` est vert.
7. Qualité : lint et format OK, aucune erreur TypeScript.
8. Intégration : mergée sur `main` via une PR qui référence la story (`Closes #n`).
9. Documentation : glossaire, ADR ou CLAUDE.md mis à jour si la story introduit
   un terme ou une décision.

## Jalon
Un Milestone est fermé quand :

1. Toutes ses stories `must` sont terminées. Une story `should` ou `could` non terminée
   est déplacée vers un autre jalon ou repasse en `wont` (le changement de label trace l'arbitrage).
2. Le parcours du jalon est vérifié sur iPhone ; la date, l'appareil et le résultat
   sont notés dans la description du Milestone.
