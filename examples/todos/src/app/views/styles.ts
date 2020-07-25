import { StyleSheet, ViewStyle } from 'react-native'

type Styles = {
  readonly container: ViewStyle
  readonly remove: ViewStyle
}

export const styles = StyleSheet.create<Styles>({
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
