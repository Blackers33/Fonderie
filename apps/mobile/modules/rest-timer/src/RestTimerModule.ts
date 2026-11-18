import { NativeModule, requireNativeModule } from 'expo'

// Décrit ce que le Kotlin expose ; TypeScript ne peut pas le vérifier
declare class RestTimerModule extends NativeModule {}

export default requireNativeModule<RestTimerModule>('RestTimer')
