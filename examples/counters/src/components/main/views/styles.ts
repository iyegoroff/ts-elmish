import { StyleSheet, ViewStyle } from 'react-native'

export const styles = StyleSheet.create<{
  readonly container: ViewStyle
  readonly remove: ViewStyle
}>({
  container: {
    padding: 10,
    backgroundColor: 'wheat',
    margin: 10,
    borderRadius: 10
  },
  remove: {
    marginBottom: 10
  }
})
