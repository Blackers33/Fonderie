package com.fonderie.resttimer

import android.content.Context
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

// Tag logcat commun aux fichiers du module
internal const val LOG_TAG = "RestTimer"

// Objet JS { countdownTitle, doneTitle, doneBody } : Expo crée l'instance
// puis remplit chaque @Field par son nom, d'où les valeurs par défaut
class RestTimerTexts : Record {
  @Field val countdownTitle: String = ""
  @Field val doneTitle: String = ""
  @Field val doneBody: String = ""
}

class RestTimerModule : Module() {
  override fun definition() = ModuleDefinition {
    // Doit correspondre à requireNativeModule('RestTimer') côté JS
    Name("RestTimer")

    Function("startRestTimer") { endsAt: Long, texts: RestTimerTexts ->
      RestTimerService.start(context, endsAt, texts)
    }

    Function("stopRestTimer") {
      RestTimerService.stop(context)
    }
  }

  // Contexte Android de l'app, nécessaire pour démarrer ou arrêter le service
  private val context: Context
    get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()
}
