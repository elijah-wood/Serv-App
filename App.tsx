import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { RootNavigator } from './src/navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { Customer } from './src/types/Customer';
import { NativeBaseProvider } from 'native-base';

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
        <SafeAreaProvider>
          <RootNavigator />
        </SafeAreaProvider>
      </NativeBaseProvider>  
    </>
  )
}

export default App
export type { RootStackParamList }
