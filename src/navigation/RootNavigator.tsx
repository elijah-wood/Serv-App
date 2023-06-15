import React, { useEffect, useState } from 'react'
import { NavigationContainer, DefaultTheme, DarkTheme, NavigationContainerRef, CommonActions } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ActivityIndicator, useColorScheme, View } from 'react-native'

import Routes from './Routes'
import { AccountNavigator } from './AccountNavigator'
import { HomeNavigator } from './HomeTabNavigator'
import { getUserSession, removeUserSession } from '../api/Session'
import { RootStackParamList } from '../../App'
import { HeaderButtonsProvider } from 'react-navigation-header-buttons'

function SplashScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  )
}

export const navigationRef = React.createRef<NavigationContainerRef<RootStackParamList>>()

export const logOut = async () => {
  await removeUserSession()
  navigationRef.current.dispatch(
      // Reset stack for Android
      CommonActions.reset({
          index: 1,
          routes: [{ name: 'Account' }],
      })
  )
}

export const RootNavigator = () => {
  const [isLoading, setIsLoading] = React.useState(true)
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false)
  
  const Stack = createNativeStackNavigator()
  const scheme = useColorScheme()

  useEffect(() => {
    const getSession = async () => {
      const session = await getUserSession()
      setLoggedIn(session !== undefined)
      setIsLoading(false)
      console.log("Session token: " + session?.token)
    }

    getSession()
  }, [])

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer ref={navigationRef} theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <HeaderButtonsProvider stackType='native'>
        <Stack.Navigator initialRouteName={isLoggedIn ? Routes.HOME : Routes.ACCOUNT} screenOptions={{ headerShown: false }}>
          <Stack.Screen name={Routes.HOME} component={HomeNavigator} options={{ headerShown: false }} />
          <Stack.Screen name={Routes.ACCOUNT} component={AccountNavigator} options={{  headerShown: false }} />
        </Stack.Navigator>
      </HeaderButtonsProvider>
    </NavigationContainer>
  )
}
