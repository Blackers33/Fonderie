# Mobile (Expo)

## Build natif

Après une modif native (Kotlin, manifeste, `build.gradle`, `app.json`, dépendance native), recompile avec `npx expo run:android` ; pour du JS, Metro suffit. Un JS qui importe un module natif absent du build plante (« Cannot find native module 'RestTimer' »).

## Composants UI

React Native Reusables n'est pas un package npm : ses composants sont copiés dans `apps/mobile/components/ui/` (style `maia`, voir `components.json`).

## NativeWind

`className` ne s'applique qu'aux composants du cœur de RN ; sur un composant tiers (ex. `KeyboardAwareScrollView`), il est ignoré sans erreur. Mets le style sur une `View` englobante, ou enregistre le composant avec `cssInterop` (exemple : `apps/mobile/lib/icons/icon-with-class-name.ts`).

## Thème

- **Couleurs définies deux fois**, à synchroniser à la main : `apps/mobile/global.css` (variables CSS, pour NativeWind) et `apps/mobile/lib/theme.ts` (`THEME`, pour React Navigation et `useThemeColor`). Une source unique est prévue (issue #70).
- **`global.css`** : triplets HSL sans virgules (`30 100% 50%`). Tailwind compose `hsl(var(--x) / a)` pour l'opacité ; avec des virgules, la couleur devient invalide et NativeWind l'ignore sans erreur. Le color picker de VS Code ajoute des virgules dans `theme.ts` (valides là-bas) : retire-les en recopiant.
- **Couleurs en chaîne côté JS** (props `style`, `theme.ts`) : avec un alpha, écris `hsla(…)`. Le parseur de RN refuse `hsl(… / a)`, et une seule couleur invalide annule toute la prop, sans erreur.
- **Mode sombre** : NativeWind suit déjà le système. `setColorScheme` force le thème au niveau natif (`Appearance.setColorScheme`) : ne l'appelle jamais dans un effet.

## Clavier

Tout écran avec un formulaire s'enveloppe dans `KeyboardAwareScreen` (`apps/mobile/components/keyboard-aware-screen.tsx`, basé sur `react-native-keyboard-controller`). Pourquoi : en edge-to-edge (Android), le système ne redimensionne plus la fenêtre de façon fiable, ce qui écarte `KeyboardAvoidingView` et `softwareKeyboardLayoutMode`.
