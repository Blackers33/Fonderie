package com.fonderie.resttimer

import android.app.AlarmManager
import android.app.Notification
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.core.app.ServiceCompat
import androidx.core.content.ContextCompat

// Service au premier plan qui vit le temps d'un repos : il garde le processus en vie
// et affiche le décompte, dessiné par Android sans mise à jour de l'app
class RestTimerService : Service() {

  override fun onBind(intent: Intent?): IBinder? = null // démarré, jamais lié
  // Repos en cours, relu quand l'alarme sonne
  private var endsAt = 0L
  private var doneTitle = ""
  private var doneBody = ""

  // Toujours la même instance : c'est elle qu'on passe à cancel()
  private val alarmListener = AlarmManager.OnAlarmListener { onRestEnded() }

  // Getters, pas valeurs : le contexte du service n'existe pas encore à sa construction
  private val alarmManager: AlarmManager
    get() = getSystemService(AlarmManager::class.java)
  private val notificationManager: NotificationManager
    get() = getSystemService(NotificationManager::class.java)

  // Appelé à chaque start(), y compris quand le service tourne déjà (nouvelle série cochée)
  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    // Jamais null : avec START_NOT_STICKY, Android ne relance pas le service sans Intent
    val startIntent = requireNotNull(intent)
    doneTitle = startIntent.getStringExtra(EXTRA_DONE_TITLE).orEmpty()
    doneBody = startIntent.getStringExtra(EXTRA_DONE_BODY).orEmpty()
    endsAt = startIntent.getLongExtra(EXTRA_ENDS_AT, 0L)
    val countdownTitle = startIntent.getStringExtra(EXTRA_COUNTDOWN_TITLE).orEmpty()

    val notification = buildCountdownNotification(endsAt, countdownTitle)
    // À appeler sans délai après startForegroundService(), sinon Android tue l'app
    ServiceCompat.startForeground(this, COUNTDOWN_NOTIFICATION_ID, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE)
    // Nouvelle série cochée : l'alarme du repos précédent est remplacée
    alarmManager.cancel(alarmListener)
    // Tag visible dans `adb shell dumpsys alarm` ; null : listener appelé sur le thread principal
    alarmManager.setExact(AlarmManager.RTC_WAKEUP, endsAt, LOG_TAG, alarmListener, null)

    logPromotion(notification)
    Log.d(LOG_TAG, "service started: ends in ${endsAt - System.currentTimeMillis()} ms")

    // Processus tué par le système : ne pas recréer le service, le repos n'aurait plus de sens
    return START_NOT_STICKY
  }

  override fun onDestroy() {
    // Stop / Passer / fin de séance : l'alerte ne doit plus partir
    alarmManager.cancel(alarmListener)
    Log.d(LOG_TAG, "service destroyed")
    super.onDestroy()
  }

  private fun buildCountdownNotification(endsAt: Long, title: String): Notification =
    NotificationCompat.Builder(this, COUNTDOWN_CHANNEL_ID)
      .setSmallIcon(appResource("notification_icon", "drawable"))
      .setColor(ContextCompat.getColor(this, appResource("notification_icon_color", "color")))
      .setContentTitle(title)
      .setContentIntent(openAppIntent())
      .setOngoing(true)
      // Chronomètre dessiné par Android jusqu'à endsAt, sans mise à jour de l'app.
      // Android arrondit à la seconde inférieure : décaler la cible donne un arrondi
      // supérieur (1:00 au départ, 0:00 à l'échéance, jamais -0:01 avant le retrait)
      .setWhen(endsAt + 999)

      .setUsesChronometer(true)
      .setChronometerCountDown(true)
      // Android 12+ peut retarder de 10 s la notif d'un service : trop pour un repos de 20 s
      .setForegroundServiceBehavior(NotificationCompat.FOREGROUND_SERVICE_IMMEDIATE)
      // Live Update (Android 16+) : demande l'affichage en pastille dans la barre d'état
      .setRequestPromotedOngoing(true)
      .build()

  // Appelé par l'alarme, sur le thread principal
  private fun onRestEnded() {
    // Mesure du retard réel de l'alarme (conservée après le spike)
    Log.d(LOG_TAG, "rest ended: delay ${System.currentTimeMillis() - endsAt} ms")
    notificationManager.notify(ALERT_NOTIFICATION_ID, buildAlertNotification())
    // La notif de décompte et la pastille disparaissent avec le service
    stopSelf()
  }

  private fun buildAlertNotification(): Notification =
    NotificationCompat.Builder(this, ALERT_CHANNEL_ID)
      .setSmallIcon(appResource("notification_icon", "drawable"))
      .setColor(ContextCompat.getColor(this, appResource("notification_icon_color", "color")))
      .setContentTitle(doneTitle)
      .setContentText(doneBody)
      .setContentIntent(openAppIntent())
      .setAutoCancel(true) // disparaît quand on la touche
      .build()

  // Toucher la notif rouvre simplement l'app
  private fun openAppIntent(): PendingIntent? =
    packageManager.getLaunchIntentForPackage(packageName)?.let {
      PendingIntent.getActivity(this, 0, it, PendingIntent.FLAG_IMMUTABLE)
    }

  // Ressources générées dans l'app par le plugin expo-notifications : invisibles
  // depuis la bibliothèque à la compilation, retrouvées par leur nom à l'exécution
  private fun appResource(name: String, type: String): Int =
    resources.getIdentifier(name, type, packageName)

  // Exploration du spike : la Live Update est-elle acceptée, et sinon pourquoi
  private fun logPromotion(notification: Notification) {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.BAKLAVA) return // API 36
    val manager = getSystemService(NotificationManager::class.java)
    Log.d(
      LOG_TAG,
      "promotable=${notification.hasPromotableCharacteristics()} canPost=${manager.canPostPromotedNotifications()}",
    )
  }
  companion object {
    private const val EXTRA_ENDS_AT = "endsAt"
    private const val EXTRA_COUNTDOWN_TITLE = "countdownTitle"
    // Doit correspondre à REST_COUNTDOWN_CHANNEL_ID (lib/notifications/rest-timer-notifications.ts)
    private const val COUNTDOWN_CHANNEL_ID = "rest-countdown"
    private const val COUNTDOWN_NOTIFICATION_ID = 1 // startForeground refuse 0
    private const val EXTRA_DONE_TITLE = "doneTitle"
    private const val EXTRA_DONE_BODY = "doneBody"
    // Doit correspondre à REST_TIMER_CHANNEL_ID (lib/notifications/rest-timer-notifications.ts)
    private const val ALERT_CHANNEL_ID = "rest-timer"
    // ≠ COUNTDOWN_NOTIFICATION_ID : la notif du service disparaît avec lui, l'alerte doit rester
    private const val ALERT_NOTIFICATION_ID = 2


    fun start(context: Context, endsAt: Long, texts: RestTimerTexts) {
      val intent = Intent(context, RestTimerService::class.java)
        .putExtra(EXTRA_ENDS_AT, endsAt)
        .putExtra(EXTRA_COUNTDOWN_TITLE, texts.countdownTitle)
        .putExtra(EXTRA_DONE_TITLE, texts.doneTitle)
        .putExtra(EXTRA_DONE_BODY, texts.doneBody)

      ContextCompat.startForegroundService(context, intent)
    }

    fun stop(context: Context) {
      context.stopService(Intent(context, RestTimerService::class.java))
    }
  }
}

