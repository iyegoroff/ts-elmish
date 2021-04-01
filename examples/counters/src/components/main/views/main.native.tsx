import React from 'react'
import { View, Button } from 'react-native'
import { Dict } from 'ts-micro-dict'
import { ElmishMemo } from '@ts-elmish/react'
import { Counter } from '../../counter'
import { styles } from './styles'

export const Main: typeof import('./Main.d').Main = ElmishMemo(({ dispatch, counters }) => {
  return (
    <View style={styles.container}>
      {Dict.toArray(counters).map(([id, counter]) => (
        <React.Fragment key={id}>
          <Counter {...counter} dispatch={(action) => dispatch(['counters-action', id, action])} />
          <View style={styles.remove}>
            <Button title={'remove'} onPress={() => dispatch(['remove-counter', id])} />
          </View>
        </React.Fragment>
      ))}
      <Button title={'add'} onPress={() => dispatch(['add-counter'])} />
    </View>
  )
})
