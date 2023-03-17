import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar'
import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NativeBaseProvider } from 'native-base'
import { expo } from './app.json'
import { AppRegistry } from 'react-native'

import { RootNavigator } from './src/navigation/RootNavigator'
import { Customer } from './src/types/Customer'

AppRegistry.registerComponent(expo.name, () => App)

type Props = Record<string, never>

type RootStackParamList = {
  Home: undefined
  Account: undefined
  Welcome: undefined
  HomeTabNavigator: undefined
  CustomersScreen: undefined
  InboxScreen: undefined
  CustomerDetailScreen: { customer: Customer }
}

const App: React.FC<Props> = () => {
  React.useEffect(() => {
    // Init
    
  }, [])

  return (
    <>
      <NativeBaseProvider>
        <StatusBar translucent backgroundColor="transparent" />
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <RootNavigator />
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </NativeBaseProvider>  
    </>
  )
}

export default App
export type { RootStackParamList }
