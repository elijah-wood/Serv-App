import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import styled from 'styled-components/native'
import { Colors } from 'react-native/Libraries/NewAppScreen'

import SignInScreen from '../screens/SignInScreen'
import Routes from '../navigation/Routes'

const Stack = createNativeStackNavigator()

export const AccountNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName={Routes.SIGN_IN}>
      <Stack.Screen name={Routes.SIGN_IN} component={SignInScreen} 
          options={{
              headerShown: false,
              title: 'Sign Up',
          }}
      />
    </Stack.Navigator>
  )
}