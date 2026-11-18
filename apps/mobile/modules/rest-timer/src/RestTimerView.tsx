import { requireNativeView } from 'expo'
import * as React from 'react'

import { RestTimerViewProps } from './RestTimer.types'

const NativeView: React.ComponentType<RestTimerViewProps> = requireNativeView('RestTimer')

export default function RestTimerView(props: RestTimerViewProps) {
  return <NativeView {...props} />
}
