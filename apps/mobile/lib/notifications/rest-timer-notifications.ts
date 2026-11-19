import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'

// Id stable : l'importance d'un canal est figée à sa création (Android 8+).
// Pour la changer un jour, il faudra un nouvel id.
// Doit correspondre à ALERT_CHANNEL_ID dans modules/rest-timer (RestTimerService.kt)
export const REST_TIMER_CHANNEL_ID = 'rest-timer'
// Doit correspondre à COUNTDOWN_CHANNEL_ID dans modules/rest-timer (RestTimerService.kt)
export const REST_COUNTDOWN_CHANNEL_ID = 'rest-countdown'

// Décompte affiché par le service natif pendant le repos.
// LOW : silencieux, sans bannière ; pas MIN, sinon ni icône en barre d'état ni Live Update
export async function ensureRestCountdownChannel(name: string) {
  if (Platform.OS !== 'android') return
  await Notifications.setNotificationChannelAsync(REST_COUNTDOWN_CHANNEL_ID, {
    name,
    importance: Notifications.AndroidImportance.LOW,
  })
}

// `name` est visible dans les réglages Android de l'app → à passer par t() dans #50
export async function ensureRestTimerChannel(name: string) {
  if (Platform.OS !== 'android') return
  await Notifications.setNotificationChannelAsync(REST_TIMER_CHANNEL_ID, {
    name,
    importance: Notifications.AndroidImportance.HIGH, // HIGH = bannière + son
    vibrationPattern: [0, 250, 250, 250],
  })
}

// 'blocked' = Android ne réaffichera plus la demande : seul recours, les réglages
export type NotificationPermission = 'granted' | 'denied' | 'blocked'

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  const current = await Notifications.getPermissionsAsync()
  if (current.granted) return 'granted'
  if (!current.canAskAgain) return 'blocked'

  const result = await Notifications.requestPermissionsAsync()
  if (result.granted) return 'granted'
  return result.canAskAgain ? 'denied' : 'blocked'
}

// Renvoie l'id de la notif planifiée (pour l'annuler plus tard : « Passer », nouvelle série…)
export function scheduleRestTimerEnd(seconds: number, content: { title: string; body: string }) {
  return Notifications.scheduleNotificationAsync({
    content,
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
      channelId: REST_TIMER_CHANNEL_ID,
    },
  })
}
