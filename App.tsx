import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar'
import * as React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NativeBaseProvider } from 'native-base'
import { expo } from './app.json'
import { AppRegistry } from 'react-native'
import { QueryClient, QueryClientProvider } from 'react-query'

import { RootNavigator } from './src/navigation/RootNavigator'
import { Channel } from './src/screens/InboxScreen'
import TokenIntercepter from './src/api/TokenIntercepter'

AppRegistry.registerComponent(expo.name, () => App)

type Props = Record<string, never>

type RootStackParamList = {
  Home: undefined
  Account: undefined
  SignInScreen: undefined
  PhoneVerificationScreen: { phone: string }
  Welcome: undefined
  HomeTabNavigator: undefined
  CustomersScreen: undefined
  AddCustomerScreen: undefined
  InboxScreen: undefined
  ChatDetail: { customer: Channel }
  CustomerDetailScreen: { customerId: string }
}

const queryClient = new QueryClient()

const App: React.FC<Props> = () => {
  React.useEffect(() => {
    // Init
    // Adding interceptors for request token, refresh token and response error handling
    TokenIntercepter.addRequestInterceptor()
    TokenIntercepter.addResponseInterceptor()

    // TODO: Refresh token call to be updated
    // TokenInterceptor.addRefreshTokenInterceptor()
  }, [])

  return (
    <>
      <NativeBaseProvider>
        <StatusBar translucent backgroundColor="transparent" />
        <QueryClientProvider client={queryClient} contextSharing={true}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
              <RootNavigator />   
            </SafeAreaProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </NativeBaseProvider>  
    </>
  )
}

export default App
export type { RootStackParamList }
