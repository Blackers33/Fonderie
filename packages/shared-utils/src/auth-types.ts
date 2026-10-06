// Réponse de POST /auth/register et POST /auth/login.
// userId : l'id du User côté serveur — c'est par lui que le mobile apprend qui il est après un login.
export type AuthResponse = {
  accessToken: string
  userId: string
}
// Longueur minimale du mot de passe — partagée : validée par le DTO API et par le formulaire mobile
export const PASSWORD_MIN_LENGTH = 8
