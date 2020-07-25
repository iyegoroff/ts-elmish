import React from 'react'
import { View, Button } from 'react-native'
import { toArray } from 'ts-micro-dict'
import { ElmishMemo } from '@ts-elmish/react'
import { Counter } from '../../counter/views'
import { styles } from './styles'

export const App: typeof import('./App.d').App = ElmishMemo(({ dispatch, counters }) => {
  return (
    <View style={styles.container}>
      {toArray(counters).map(([id, counter]) => (
        <React.Fragment key={id}>
          <Counter {...counter} dispatch={(action) => dispatch(['counter-action', id, action])} />
          <View style={styles.remove}>
            <Button title={'remove'} onPress={() => dispatch(['remove-counter', id])} />
          </View>
        </React.Fragment>
      ))}
      <Button title={'add'} onPress={() => dispatch(['add-counter'])} />
    </View>
  )
})
