import { NativeModule, requireNativeModule } from 'expo'

import { RestTimerModuleEvents } from './RestTimer.types'

declare class RestTimerModule extends NativeModule<RestTimerModuleEvents> {
  PI: number
  hello(): string
  setValueAsync(value: string): Promise<void>
}

// This call loads the native module object from the JSI.
export default requireNativeModule<RestTimerModule>('RestTimer')
