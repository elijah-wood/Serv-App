import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar'
import * as React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NativeBaseProvider } from 'native-base'
import { expo } from './app.json'
import { AppRegistry } from 'react-native'
import { QueryClient, QueryClientProvider } from 'react-query'
import * as Sentry from '@sentry/react-native'

import { RootNavigator } from './src/navigation/RootNavigator'
import TokenIntercepter from './src/api/TokenIntercepter'
import { Job } from './src/api/UseJobs'

AppRegistry.registerComponent(expo.name, () => App)

type Props = Record<string, never>

type RootStackParamList = {
  Home: undefined
  Account: undefined
  SignInScreen: undefined
  PhoneVerificationScreen: { phone: string }
  Welcome: undefined
  HomeNavigator: undefined
  CustomersScreen: undefined
  CustomerDetailScreen: { customerId: string }
  AddCustomerScreen: undefined
  JobsScreen: undefined
  JobDetailScreen: { jobId: string }
  AddJobScreen: { customerId: string }
  InboxScreen: undefined
  ChatDetail: { conversationSid: string, name: string }
  TeamScreen: undefined
  AnalyticsScreen: undefined
  InvoiceScreen: { job: Job }
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

    if (!__DEV__) {
      Sentry.init({
        dsn: "https://3aea386828174449ae479b8159d4efc1@o4505076625113088.ingest.sentry.io/4505076626423808",
        tracesSampleRate: 1.0,
        debug: false
      })
    }
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

export default Sentry.wrap(App)

export type { RootStackParamList }
