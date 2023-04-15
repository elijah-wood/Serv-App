import React, { useEffect, useState } from 'react'
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ActivityIndicator, useColorScheme, View } from 'react-native'

import Routes from './Routes'
import { AccountNavigator } from './AccountNavigator'
import { HomeTabNavigator } from './HomeTabNavigator'
import { getUserSession } from '../api/Session'

function SplashScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
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
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator initialRouteName={isLoggedIn ? Routes.HOME : Routes.ACCOUNT} screenOptions={{ headerShown: false }}>
        <Stack.Screen name={Routes.HOME} component={HomeTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name={Routes.ACCOUNT} component={AccountNavigator} options={{  headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
