import React from 'react'
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useColorScheme } from 'react-native'

import Routes from './Routes'
import { AccountNavigator } from './AccountNavigator'
import { HomeTabNavigator } from './HomeTabNavigator'

export const RootNavigator = () => {
  const Stack = createNativeStackNavigator()
  const scheme = useColorScheme()

  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator initialRouteName={Routes.ACCOUNT} screenOptions={{ headerShown: false }}>
        <Stack.Screen name={Routes.HOME} component={HomeTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name={Routes.ACCOUNT} component={AccountNavigator} options={{  headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
