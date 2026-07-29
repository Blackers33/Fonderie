import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { useColorScheme, View } from 'react-native'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Text } from '@/components/ui/text'

export default function AuthScreen() {
  const router = useRouter()
  const { t } = useTranslation()
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const containerClassName = isDark
    ? 'flex-1 items-center justify-center bg-background px-6 py-10'
    : 'flex-1 items-center justify-center bg-card px-6 py-10'

  return (
    <View className={containerClassName}>
      <Text className="text-xl font-bold text-foreground">{t('auth.appName')}</Text>
      <Text className="text-sm text-muted-foreground">{t('auth.tagline')}</Text>
      <View className="h-8 w-full opacity-0" />
      <Card className="w-full max-w-sm">
        <CardContent>
          <View className="w-full justify-center gap-4">
            <View className="gap-2">
              <Text className="text-sm font-medium text-foreground">{t('auth.email')}</Text>
              <Input id="email" placeholder={t('auth.emailPlaceholder')} />
            </View>
            <View className="gap-2">
              <Text className="text-sm font-medium text-foreground">{t('auth.password')}</Text>
              <PasswordInput id="password" placeholder="••••••••" />
            </View>
          </View>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button className="w-full">
            <Text>{t('auth.signIn')}</Text>
          </Button>
          <Text className="text-xs text-muted-foreground">- or -</Text>
          <Button variant="outline" className="w-full" onPress={() => router.replace('/(tabs)')}>
            <Text>{t('auth.continueAsGuest')}</Text>
          </Button>
          <View className="h-4 w-full opacity-0" />
          <Text className="text-xs text-muted-foreground">
            {t('auth.noAccount')} <Text className="underline text-xs">{t('auth.signUp')}</Text>
          </Text>
        </CardFooter>
      </Card>
    </View>
  )
}
