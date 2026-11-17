// Export ponctuel du catalogue global Turso → JSON embarqué dans le mobile (seed de démo, label `tp`).
// À supprimer avec le seed quand #65 sera fait, sauf si l'endpoint reprend cette requête.
import 'dotenv/config' // charge apps/api/.env (le cwd d'un script pnpm = le dossier du package)
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { asc, eq } from 'drizzle-orm'
import { createDb } from '../src/db/client'
import { exercises } from '../src/db/schema'

// Chemin relatif au fichier du script, pas au cwd : marche d'où qu'on le lance
const OUTPUT_PATH = resolve(__dirname, '../../mobile/assets/seed/exercises.json')

async function main() {
  const db = createDb()
  const rows = await db
    .select()
    .from(exercises)
    .where(eq(exercises.isCustom, false)) // jamais les exercices custom des users
    .orderBy(asc(exercises.id)) // ordre stable → diffs git lisibles entre deux exports

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true }) // crée assets/seed/ s'il n'existe pas
  writeFileSync(OUTPUT_PATH, `${JSON.stringify(rows, null, 2)}\n`)
  console.log(`Exported ${rows.length} exercises to ${OUTPUT_PATH}`)
}

// Pas de top-level await en CommonJS → fonction main + code de sortie non nul en cas d'erreur
main().catch(error => {
  console.error(error)
  process.exit(1)
})
