import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import styled from 'styled-components/native'
import { Colors } from 'react-native/Libraries/NewAppScreen'

import WelcomeScreen from '../screens/WelcomeScreen'
import routes from '../navigation/Routes'

const Stack = createNativeStackNavigator()

export const AccountNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName={routes.WELCOME}
      screenOptions={{
        contentStyle: { backgroundColor: Colors.white },
        headerStyle: { backgroundColor: Colors.white },
        headerTintColor: Colors.black,
        headerTitleStyle: { color: 'black', fontFamily: 'BeVietnam-Medium' },
      }}>
      <Stack.Screen options={{ headerShown: false }} name="Welcome" component={WelcomeScreen} />
      {/* <Stack.Screen
        options={{
          headerShown: false,
          title: 'Sign In',
          header: () => <TitleText>Sign In</TitleText>,
        }}
        name={routes.SIGNIN}
        component={SignInScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          title: 'Sign Up',
          header: () => <TitleText>Sign Up</TitleText>,
        }}
        name={routes.SIGNUP}
        component={SignUpScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          title: 'Forgot Password',
          header: () => <TitleText>Forgot Password</TitleText>,
        }}
        name={routes.FORGOT_PASSWORD}
        component={ForgotPasswordScreen}
      />  */}
    </Stack.Navigator>
  )
}

const TitleText = styled.Text`
  font-size: 16px;
  font-family: 'BeVietnam-regular';
`
