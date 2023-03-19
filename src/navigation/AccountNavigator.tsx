import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import SignInScreen from '../screens/SignInScreen'
import PhoneVerificationScreen from '../screens/PhoneVerificationScreen'
import Routes from '../navigation/Routes'

const Stack = createNativeStackNavigator()

export const AccountNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName={Routes.SIGN_IN}>
      <Stack.Screen name={Routes.SIGN_IN} component={SignInScreen} 
          options={{
              headerShown: false,
          }}
      />
      <Stack.Screen name={Routes.PHONE_VERIFICATION_SCREEN} component={PhoneVerificationScreen} 
          options={{
              headerShown: false,
          }}
      />
    </Stack.Navigator>
  )
}