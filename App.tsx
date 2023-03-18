import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar'
import * as React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NativeBaseProvider } from 'native-base'
import { expo } from './app.json'
import { AppRegistry } from 'react-native'

import { RootNavigator } from './src/navigation/RootNavigator'
import { Customer } from './src/types/Customer'
import { AppProvider } from './src/stream/AppContext'
import { Chat, OverlayProvider } from 'stream-chat-expo'
import { StreamChat } from 'stream-chat'
import { chatApiKey } from './chatConfig'

AppRegistry.registerComponent(expo.name, () => App)

type Props = Record<string, never>

type RootStackParamList = {
  Home: undefined
  Account: undefined
  SignInScreen: undefined
  Welcome: undefined
  HomeTabNavigator: undefined
  CustomersScreen: undefined
  InboxScreen: undefined
  ChatScreen: undefined
  CustomerDetailScreen: { customer: Customer }
}

const chatClient = StreamChat.getInstance(chatApiKey)

const App: React.FC<Props> = () => {
  React.useEffect(() => {
    // Init
    
  }, [])

  return (
    <>
      <NativeBaseProvider>
        <StatusBar translucent backgroundColor="transparent" />
        <AppProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
              <OverlayProvider>
                <Chat client={chatClient}>
                  <RootNavigator />   
                </Chat>
              </OverlayProvider>
            </SafeAreaProvider>
          </GestureHandlerRootView>
        </AppProvider>
      </NativeBaseProvider>  
    </>
  )
}

export default App
export type { RootStackParamList }
