package com.fonderie.resttimer

import android.util.Log
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

// Tag logcat commun aux fichiers du module (le service s'en servira aussi)
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

    // endsAt : instant de fin, en millisecondes depuis l'epoch (même échelle que Date.now())
    Function("startRestTimer") { endsAt: Long, texts: RestTimerTexts ->
      val delayMs = endsAt - System.currentTimeMillis()
      Log.d(LOG_TAG, "start: ends in $delayMs ms, title=${texts.countdownTitle}")
    }

    Function("stopRestTimer") {
      Log.d(LOG_TAG, "stop")
    }
  }
}
