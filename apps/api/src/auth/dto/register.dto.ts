import { PASSWORD_MIN_LENGTH } from '@workspace/shared-utils'
import { IsEmail, IsString, IsUUID, MinLength } from 'class-validator'

export class RegisterDto {
  // L'UUID généré localement par le mobile en mode Invité.
  // Il devient l'id du compte serveur
  @IsUUID('4')
  id!: string

  @IsEmail()
  email!: string

  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH)
  password!: string
}
