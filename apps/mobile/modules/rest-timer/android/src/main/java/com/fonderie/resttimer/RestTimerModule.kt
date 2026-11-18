package com.fonderie.resttimer

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class RestTimerModule : Module() {
  override fun definition() = ModuleDefinition {
    // Doit correspondre à requireNativeModule('RestTimer') côté JS
    Name("RestTimer")
  }
}
