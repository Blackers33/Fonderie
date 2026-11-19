import { Pressable } from 'react-native'
import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'

type SetRowProps = {
  setId: string
  number: number
  label: string // déjà traduit : « 8 × 60 kg »
  completed: boolean
  restSeconds: number
  onToggle: (setId: string, completed: boolean, restSeconds: number) => void
}

function SetRow({ setId, number, label, completed, restSeconds, onToggle }: SetRowProps) {
  return (
    <Pressable
      onPress={() => onToggle(setId, !completed, restSeconds)}
      className={cn(
        'flex-row items-center gap-4 rounded-md px-2 py-2',
        completed && 'bg-primary/15',
      )}
    >
      <Text className="w-6 text-muted-foreground">{number}</Text>
      <Text className="text-foreground">{label}</Text>
      {completed && <Text className="ml-auto text-primary">✓</Text>}
    </Pressable>
  )
}

export { SetRow }
