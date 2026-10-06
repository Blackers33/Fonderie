// Échecs possibles de /auth/register et /auth/login, du point de vue de l'écran.
// 'network' n'a pas de statut HTTP : il est produit par auth-api quand fetch lève une exception.
export type AuthErrorCode = 'emailTaken' | 'invalidCredentials' | 'network' | 'unknown'

export function toAuthErrorCode(status: number): AuthErrorCode {
  switch (status) {
    // Une collision d'id renvoie aussi 409 (bug client uniquement) : affichée à tort
    // comme emailTaken — accepté, le message distinct reste visible dans les logs API.
    case 409:
      return 'emailTaken'
    case 401:
      return 'invalidCredentials'
    default:
      return 'unknown'
  }
}
