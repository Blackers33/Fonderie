import * as Crypto from 'expo-crypto'
import { useRouter } from 'expo-router'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type TextInput, View } from 'react-native'
import { KeyboardAwareScreen } from '@/components/keyboard-aware-screen'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Text } from '@/components/ui/text'
import { login } from '@/lib/auth/auth-api'
import type { AuthErrorCode } from '@/lib/auth/auth-errors'
import { useIdentity } from '@/lib/auth/identity-context'
import { validateEmail } from '@/lib/auth/sign-up-validation'

export default function AuthScreen() {
  const router = useRouter()
  const { t } = useTranslation()
  const { updateIdentity } = useIdentity()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState<'invalidEmail' | null>(null)
  const [passwordError, setPasswordError] = useState<'passwordRequired' | null>(null)
  const [submitError, setSubmitError] = useState<AuthErrorCode | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const passwordRef = useRef<TextInput>(null)

  function handleEmailChange(text: string) {
    const value = text.trim()
    setEmail(value)
    if (emailError) setEmailError(validateEmail(value))
  }

  function handlePasswordChange(text: string) {
    setPassword(text)
    if (passwordError && text !== '') setPasswordError(null)
  }

  async function handleSignIn() {
    if (isSubmitting) return
    const nextEmailError = validateEmail(email)
    // Pas de règle de longueur : elle concerne la création, pas la vérification
    const nextPasswordError = password === '' ? 'passwordRequired' : null
    setEmailError(nextEmailError)
    setPasswordError(nextPasswordError)
    if (nextEmailError || nextPasswordError) return

    setSubmitError(null)
    setIsSubmitting(true)
    const result = await login(email, password)
    if (!result.ok) {
      setSubmitError(result.error)
      setIsSubmitting(false)
      return
    }
    await updateIdentity({ userId: result.data.userId, accessToken: result.data.accessToken })
  }

  return (
    <KeyboardAwareScreen className="bg-background">
      <Text className="text-xl font-bold text-foreground">{t('auth.appName')}</Text>
      <Text className="text-sm text-muted-foreground">{t('auth.tagline')}</Text>
      <View className="h-8 w-full opacity-0" />
      <Card className="w-full max-w-sm">
        <CardContent>
          <View className="w-full justify-center gap-4">
            <View className="gap-2">
              <Text className="text-sm font-medium text-foreground">{t('auth.email')}</Text>
              <Input
                id="email"
                placeholder={t('auth.emailPlaceholder')}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={email}
                onChangeText={handleEmailChange}
                onBlur={() => email !== '' && setEmailError(validateEmail(email))}
                returnKeyType="next"
                submitBehavior="submit"
                onSubmitEditing={() => passwordRef.current?.focus()}
              />
              {emailError && (
                <Text className="text-xs text-destructive">{t(`authErrors.${emailError}`)}</Text>
              )}
            </View>
            <View className="gap-2">
              <Text className="text-sm font-medium text-foreground">{t('auth.password')}</Text>
              <PasswordInput
                id="password"
                placeholder="••••••••"
                autoComplete="current-password"
                autoCapitalize="none"
                value={password}
                onChangeText={handlePasswordChange}
                ref={passwordRef}
                returnKeyType="go"
                onSubmitEditing={handleSignIn}
              />
              {passwordError && (
                <Text className="text-xs text-destructive">{t(`authErrors.${passwordError}`)}</Text>
              )}
            </View>
          </View>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          {submitError && (
            <Text className="text-xs text-destructive">{t(`authErrors.${submitError}`)}</Text>
          )}
          <Button className="w-full" disabled={isSubmitting} onPress={handleSignIn}>
            <Text>{isSubmitting ? t('auth.signingIn') : t('auth.signIn')}</Text>
          </Button>
          <Text className="text-xs text-muted-foreground">{t('auth.orDivider')}</Text>
          <Button
            variant="outline"
            className="w-full"
            disabled={isSubmitting}
            onPress={() => updateIdentity({ userId: Crypto.randomUUID(), accessToken: null })}
          >
            <Text>{t('auth.continueAsGuest')}</Text>
          </Button>
          <View className="h-4 w-full opacity-0" />
          <Text className="text-xs text-muted-foreground">
            {t('auth.noAccount')}{' '}
            <Text className="underline text-xs" onPress={() => router.push('/sign-up')}>
              {t('auth.signUp')}
            </Text>
          </Text>
        </CardFooter>
      </Card>
    </KeyboardAwareScreen>
  )
}
