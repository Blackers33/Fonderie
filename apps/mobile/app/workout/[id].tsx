import { useLocalSearchParams } from 'expo-router'
import { View } from 'react-native'
import { Text } from '@/components/ui/text'

export default function WorkoutDetailScreen() {
  // Le [id] du nom de fichier arrive ici
  const { id } = useLocalSearchParams<{ id: string }>()
  return (
    <View className="flex-1 bg-background p-4">
      <Text>{id}</Text>
    </View>
  )
}
