import type { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { cn } from '@/lib/utils'

// Marge gardée entre le champ actif et le clavier : assez pour que le bouton
// de soumission, placé sous le dernier champ, reste visible. Réglée à l'œil sur appareil.
const DEFAULT_BOTTOM_OFFSET = 120

type KeyboardAwareScreenProps = {
  children: ReactNode
  className?: string
  bottomOffset?: number
}

function KeyboardAwareScreen({
  children,
  className,
  bottomOffset = DEFAULT_BOTTOM_OFFSET,
}: KeyboardAwareScreenProps) {
  return (
    // Le fond vit ici : className est ignoré sans erreur sur KeyboardAwareScrollView (composant tiers)
    <View className={cn('flex-1', className)}>
      <KeyboardAwareScrollView
        bottomOffset={bottomOffset}
        // Un tap sur un bouton agit dès le premier essai ; un tap dans le vide ferme le clavier
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        {children}
      </KeyboardAwareScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24, // = px-6 actuel
    paddingVertical: 40, // = py-10 actuel
  },
})

export { KeyboardAwareScreen }
