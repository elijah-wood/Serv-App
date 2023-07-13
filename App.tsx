import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NativeBaseProvider } from 'native-base'
import { expo } from './app.json'
import { AppRegistry, Platform } from 'react-native'
import { QueryClient, QueryClientProvider } from 'react-query'
import * as Sentry from '@sentry/react-native'
import { useEffect, useRef } from 'react'
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import { HeaderButtonsProvider } from 'react-navigation-header-buttons';

import { RootNavigator } from './src/navigation/RootNavigator'
import TokenIntercepter from './src/api/TokenIntercepter'
import { Job } from './src/api/UseJobs'
import { InvoiceEstimateItem } from './src/api/UseCreateInvoice'
import { InvoiceEstimateType } from './src/screens/InvoiceScreen'
import { Customer, Member } from './src/api/UseCustomers'

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
  AddCustomerScreen: { customer?: Customer }
  ImportCustomersScreen: { customers?: Customer[] }
  JobsScreen: undefined
  JobDetailScreen: { jobId: string }
  AddJobScreen: { customerId: string }
  InboxScreen: undefined
  ChatDetail: { conversationSid: string, name: string }
  TeamScreen: undefined
  AnalyticsScreen: undefined
  InvoiceScreen: { job: Job, type?: InvoiceEstimateType, invoiceId?: string, estimateId?: string, dueDate?: string, invoiceEstimateItems?: InvoiceEstimateItem[], notes?: string }
  AddMemberScreen: undefined,
  ImportTeamMembersScreen: { members?: Member[] },
  JobNotesEditScreen: { job: Job }
}

const queryClient = new QueryClient()

const App: React.FC<Props> = () => {
  useEffect(() => {
    // Init
    if (!__DEV__) {
      Sentry.init({
        dsn: "https://3aea386828174449ae479b8159d4efc1@o4505076625113088.ingest.sentry.io/4505076626423808",
        tracesSampleRate: 1.0,
        debug: false
      })
    }

    // Adding interceptors for request token, refresh token and response error handling
    TokenIntercepter.addRequestInterceptor()
    TokenIntercepter.addResponseInterceptor()

    // TODO: Refresh token call to be updated
    TokenIntercepter.addRefreshTokenInterceptor()
  }, [])

  return (
    <>
      <NativeBaseProvider>
        <StatusBar translucent backgroundColor="transparent" />
        <QueryClientProvider client={queryClient} contextSharing={true}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
              <ActionSheetProvider>
                <RootNavigator />   
              </ActionSheetProvider>
            </SafeAreaProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </NativeBaseProvider>
    </>
  )
}

export default Sentry.wrap(App)

export type { RootStackParamList }
