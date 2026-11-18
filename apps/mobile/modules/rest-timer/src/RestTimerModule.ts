import { NativeModule, requireNativeModule } from 'expo'

// Textes déjà traduits : le natif n'a pas accès à i18next
type RestTimerTexts = {
  countdownTitle: string // notif de décompte
  doneTitle: string // alerte de fin de repos
  doneBody: string
}

// Décrit ce que le Kotlin expose ; TypeScript ne peut pas le vérifier
declare class RestTimerModule extends NativeModule {
  startRestTimer(endsAt: number, texts: RestTimerTexts): void
  stopRestTimer(): void
}

export default requireNativeModule<RestTimerModule>('RestTimer')
