import { registerWebModule, NativeModule } from 'expo'

import { ChangeEventPayload } from './RestTimer.types'

type RestTimerModuleEvents = {
  onChange: (params: ChangeEventPayload) => void
}

class RestTimerModule extends NativeModule<RestTimerModuleEvents> {
  PI = Math.PI
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value })
  }
  hello() {
    return 'Hello world! 👋'
  }
}

export default registerWebModule(RestTimerModule, 'RestTimerModule')
