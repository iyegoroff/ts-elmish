import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

export const styles = StyleSheet.create<{
  readonly container: ViewStyle
  readonly count: TextStyle
}>({
  container: {},
  count: {
    marginBottom: 5,
    fontSize: 20,
    fontWeight: 'bold'
  }
})
