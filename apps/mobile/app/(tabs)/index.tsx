import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { HomeHeader } from '@/components/home-header'
import { RoutineCard } from '@/components/routine-card'
import { Text } from '@/components/ui/text'
import { useRoutinePreviews } from '@/hooks/use-routine-previews'
import { useIdentity } from '@/lib/auth/identity-context'

export default function HomeScreen() {
  const { t } = useTranslation()
  const { identity } = useIdentity()
  // Cet écran n'est rendu qu'avec une identité, sauf lors d'un éventuel dernier rendu
  // pendant un Reset : un userId vide ne correspond à aucune ligne, rien ne s'affiche.
  const { routines, isLoaded } = useRoutinePreviews(identity?.userId ?? '')

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <FlatList
        className="bg-background"
        contentContainerClassName="gap-3 p-4"
        ListHeaderComponent={HomeHeader}
        data={routines}
        keyExtractor={routine => routine.id}
        renderItem={({ item }) => (
          <RoutineCard routine={item} onPress={() => router.push(`/routine/${item.id}`)} />
        )}
        // Avant la 1ʳᵉ réponse de SQLite, la liste est vide sans l'être vraiment :
        // on n'affiche le message qu'une fois le chargement terminé.
        ListEmptyComponent={
          isLoaded ? (
            <Text className="text-center text-muted-foreground">{t('home.noRoutines')}</Text>
          ) : null
        }
      />
    </SafeAreaView>
  )
}
