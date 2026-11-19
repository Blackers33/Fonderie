// Secondes de repos restantes, telles que le décompte les affiche
export function getRemainingRestSeconds(restEndsAt: number, now: number): number {
  return Math.max(0, Math.ceil((restEndsAt - now) / 1000))
}
// Durée affichée par le décompte : 90 → '1:30'
export function formatRest(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return `${minutes}:${rest.toString().padStart(2, '0')}`
}
