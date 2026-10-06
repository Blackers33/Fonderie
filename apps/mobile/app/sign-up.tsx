import { PASSWORD_MIN_LENGTH } from '@workspace/shared-utils'
import * as Crypto from 'expo-crypto'
import { Stack, useRouter } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Text } from '@/components/ui/text'
import { register } from '@/lib/auth/auth-api'
import type { AuthErrorCode } from '@/lib/auth/auth-errors'
import { useIdentity } from '@/lib/auth/identity-context'
import { validateEmail, validatePassword } from '@/lib/auth/sign-up-validation'

export default function SignUpScreen() {
  const router = useRouter()
  const { t } = useTranslation()
  const { updateIdentity } = useIdentity()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState<'invalidEmail' | null>(null)
  const [passwordError, setPasswordError] = useState<'passwordTooShort' | null>(null)
  const [submitError, setSubmitError] = useState<AuthErrorCode | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleEmailChange(text: string) {
    const value = text.trim() // les claviers ajoutent une espace après une suggestion
    setEmail(value)
    if (emailError) setEmailError(validateEmail(value)) // revalide seulement si une erreur est affichée
  }

  function handlePasswordChange(text: string) {
    setPassword(text)
    if (passwordError) setPasswordError(validatePassword(text))
  }

  async function handleSubmit() {
    const nextEmailError = validateEmail(email)
    const nextPasswordError = validatePassword(password)
    setEmailError(nextEmailError)
    setPasswordError(nextPasswordError)
    if (nextEmailError || nextPasswordError) return

    setSubmitError(null)
    setIsSubmitting(true)
    const result = await register(Crypto.randomUUID(), email, password)
    if (!result.ok) {
      setSubmitError(result.error)
      setIsSubmitting(false)
      return
    }
    // Succès : Stack.Protected démonte cet écran, inutile de remettre isSubmitting à false
    await updateIdentity({ userId: result.data.userId, accessToken: result.data.accessToken })
  }

  return (
    <View className="flex-1 items-center justify-center bg-background px-6 py-10">
      <Stack.Screen options={{ title: t('signUp.title') }} />
      <Card className="w-full max-w-sm">
        <CardContent>
          <View className="w-full justify-center gap-4">
            <View className="gap-2">
              <Text className="text-sm font-medium text-foreground">{t('auth.email')}</Text>
              <Input
                placeholder={t('auth.emailPlaceholder')}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={email}
                onChangeText={handleEmailChange}
                onBlur={() => email !== '' && setEmailError(validateEmail(email))}
              />
              {emailError && (
                <Text className="text-xs text-destructive">{t(`authErrors.${emailError}`)}</Text>
              )}
            </View>
            <View className="gap-2">
              <Text className="text-sm font-medium text-foreground">{t('auth.password')}</Text>
              <PasswordInput
                placeholder="••••••••"
                autoComplete="new-password"
                value={password}
                onChangeText={handlePasswordChange}
                onBlur={() => password !== '' && setPasswordError(validatePassword(password))}
              />
              {passwordError && (
                <Text className="text-xs text-destructive">
                  {t(`authErrors.${passwordError}`, { count: PASSWORD_MIN_LENGTH })}
                </Text>
              )}
            </View>
          </View>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          {submitError && (
            <Text className="text-xs text-destructive">{t(`authErrors.${submitError}`)}</Text>
          )}
          <Button className="w-full" disabled={isSubmitting} onPress={handleSubmit}>
            <Text>{isSubmitting ? t('signUp.submitting') : t('signUp.submit')}</Text>
          </Button>

          <View className="h-4 w-full opacity-0" />
          <Text className="text-xs text-muted-foreground">
            {t('signUp.hasAccount')}{' '}
            <Text className="underline text-xs" onPress={() => router.back()}>
              {t('auth.signIn')}
            </Text>
          </Text>
        </CardFooter>
      </Card>
    </View>
  )
}
