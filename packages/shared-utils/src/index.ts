//TODO : voir à quoi sert cette fonction, et eventuellement la supprimer si elle n'est pas utilisée
export function getHelloWorld(): string {
  return 'Hello World'
}

export * from './auth-types'
/*
 * Note : l'erreur'
 * "Relative import paths need explicit file extensions in ECMAScript imports when '--moduleResolution' is
 * 'node16' or 'nodenext'. Did you mean './locales.js'?"
 * est ignorée car elle est un faux positif. Le code est compilé correctement et fonctionne comme prévu.
 */
export * from './exercise-enums'
export * from './locales'
export * from './workout-types'
