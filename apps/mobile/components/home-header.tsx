import { useTranslation } from 'react-i18next'
import { useColorScheme, View } from 'react-native'
import { Text } from '@/components/ui/text'
import { Flame } from '@/lib/icons/flame'
import { TrendingUp } from '@/lib/icons/trending-up'
import { Zap } from '@/lib/icons/zap'
import { Button } from './ui/button'
import { Card } from './ui/card'

function HomeHeader() {
  const { t } = useTranslation()
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  return (
    <View className="gap-4 p-0">
      <View>
        <Text className="text-lg font-bold">{t('home.todaysTraining')}</Text>
      </View>

      <View className="flex-row gap-3">
        <Card className="flex-1 gap-2 p-2">
          <Flame color="#FF6B6B" />
          <Text className="text-xs text-muted-foreground">{t('home.streak')}</Text>
          <Text className="text-m text-foreground">{t('home.days', { count: 12 })}</Text>
        </Card>
        <Card className="flex-1 gap-2 p-2">
          <Zap color="#E1FF00" />
          <Text className="text-xs text-muted-foreground">{t('home.thisWeek')}</Text>
          <Text className="text-m text-foreground">4/5</Text>
        </Card>
        <Card className="flex-1 gap-2 p-2">
          <TrendingUp color="#4ECDC4" />
          <Text className="text-xs text-muted-foreground">{t('home.volume')}</Text>
          <Text className="text-m text-foreground">+8%</Text>
        </Card>
      </View>

      <View className="flex-row items-center justify-between">
        <Text className="text-base font-semibold">{t('home.myRoutines')}</Text>
        <Button
          className={!isDark ? 'border-border' : undefined}
          onPress={() => console.log('Add routine')}
        >
          <Text>+</Text>
        </Button>
      </View>
    </View>
  )
}

export { HomeHeader }
