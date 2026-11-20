import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Vibration, View } from 'react-native'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { formatRest, getRemainingRestSeconds } from '@/lib/rest-countdown'

type RestTimerProps = {
  restEndsAt: number
  vibrate: boolean // false quand l'alerte native s'en charge
  onEnd: () => void // repos arrivé à 0
  onSkip: () => void // bouton « Passer »
}

function RestTimer({ restEndsAt, vibrate, onEnd, onSkip }: RestTimerProps) {
  const { t } = useTranslation()
  const [now, setNow] = useState(Date.now)
  const remaining = getRemainingRestSeconds(restEndsAt, now)

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(interval) // arrêté quand le minuteur disparaît
  }, [])

  // À 0 : vibration si besoin, puis le minuteur disparaît
  useEffect(() => {
    if (remaining > 0) return
    if (vibrate) Vibration.vibrate(500)
    onEnd()
  }, [remaining, vibrate, onEnd])

  return (
    <View className="flex-row items-center justify-between rounded-md bg-primary/15 px-4 py-3">
      <Text className="text-2xl font-semibold text-foreground">{formatRest(remaining)}</Text>
      <Button variant="outline" onPress={onSkip}>
        <Text>{t('workout.skipRest')}</Text>
      </Button>
    </View>
  )
}

export { RestTimer }
