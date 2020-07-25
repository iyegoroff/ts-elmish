import { StyleSheet, ViewStyle, TextStyle } from 'react-native'

type Styles = {
  readonly container: ViewStyle
  readonly count: TextStyle
}

export const styles = StyleSheet.create<Styles>({
  container: {},
  count: {
    marginBottom: 5,
    fontSize: 20,
    fontWeight: 'bold'
  }
})
