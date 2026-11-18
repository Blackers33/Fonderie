// Reexport the native module. On web, it will be resolved to RestTimerModule.web.ts
// and on native platforms to RestTimerModule.ts
export { default } from './src/RestTimerModule'
export { default as RestTimerView } from './src/RestTimerView'
export * from './src/RestTimer.types'
