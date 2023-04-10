import React, { useEffect, useState } from 'react'
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useColorScheme } from 'react-native'

import Routes from './Routes'
import { AccountNavigator } from './AccountNavigator'
import { HomeTabNavigator } from './HomeTabNavigator'
import { getUserSession } from '../api/Session'

export const RootNavigator = () => {
  const [isLoggedIn, setLoggedIn] = useState<boolean | null>(null)
  
  const Stack = createNativeStackNavigator()
  const scheme = useColorScheme()

  useEffect(() => {
    const getSession = async () => {
      const session = await getUserSession()
      setLoggedIn(session !== undefined)
    }

    getSession()
  }, [])

  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator initialRouteName={Routes.ACCOUNT} screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <>
            <Stack.Screen name={Routes.HOME} component={HomeTabNavigator} options={{ headerShown: false }} />
          </>
        ) : ( 
          <>
            <Stack.Screen name={Routes.ACCOUNT} component={AccountNavigator} options={{  headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
