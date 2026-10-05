import { drizzle } from 'drizzle-orm/expo-sqlite'
import { openDatabaseSync } from 'expo-sqlite'
import * as schema from './schema'

// Nom historique (ancien nom de l'app) conservé volontairement : le renommer
// créerait une nouvelle base vide sur les installations existantes.
const expoDb = openDatabaseSync('gainsflow.db')

export const db = drizzle(expoDb, { schema })
