import { AppRegistry } from 'react-native'
import { Main } from './build-native/main-native'
import { name as appName } from './app.json'

AppRegistry.registerComponent(appName, () => Main)
