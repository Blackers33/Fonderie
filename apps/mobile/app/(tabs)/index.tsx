import { FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { HomeHeader } from '@/components/home-header'
import { RoutineCard } from '@/components/routine-card'
import { MOCK_ROUTINES } from '@/lib/mock-routines'

export default function HomeScreen() {
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <FlatList
        className="bg-background"
        contentContainerClassName="gap-3 p-4"
        ListHeaderComponent={HomeHeader}
        data={MOCK_ROUTINES}
        keyExtractor={routine => routine.id}
        renderItem={({ item }) => (
          <RoutineCard routine={item} onPress={() => console.log('Open routine', item.id)} />
        )}
      />
    </SafeAreaView>
  )
}
