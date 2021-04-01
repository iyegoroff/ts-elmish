import { AppRegistry } from 'react-native'
import { App } from './build/native/main'
import { name as appName } from './app.json'

AppRegistry.registerComponent(appName, () => App)
