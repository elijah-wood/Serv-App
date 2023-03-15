import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { RootNavigator } from './src/navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { Customer } from './src/types/Customer';

type Props = Record<string, never>


type RootStackParamList = {
  Home: undefined
  Account: undefined
  Welcome: undefined
  HomeTabNavigator: undefined
  CustomersScreen: undefined
  CustomerDetailScreen: { customer: Customer }
}

const App: React.FC<Props> = () => {
  React.useEffect(() => {
    // Init
  }, [])

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" />
      <SafeAreaProvider>
        <RootNavigator />
      </SafeAreaProvider>
      
    </>
  )
}

export default App
export type { RootStackParamList }
