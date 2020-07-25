import React from 'react'
import { View, Text, Button } from 'react-native'
import { ElmishMemo } from '@ts-elmish/react'
import { styles } from './styles'

export const Counter: typeof import('./Counter.d').Counter = ElmishMemo(({ dispatch, count }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.count}>{count}</Text>
      <Button title={'+'} onPress={() => dispatch(['increment'])} />
      <Button title={'-'} onPress={() => dispatch(['decrement'])} />
    </View>
  )
})
