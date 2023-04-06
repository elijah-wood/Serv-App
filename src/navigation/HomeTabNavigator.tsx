import React from 'react'
import { Button, Image } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../../App'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import CustomersScreen from '../screens/CustomersScreen'
import CustomerDetailScreen from '../screens/CustomerDetailScreen'
import Routes from './Routes'
import InboxScreen from '../screens/InboxScreen'
import ChatDetail from '../screens/ChatDetail'
import AddCustomerScreen from '../screens/AddCustomerScreen'

type NavigationProp = StackNavigationProp<RootStackParamList, 'HomeTabNavigator'>

type Props = {
  navigation: NavigationProp
}

export const InboxStackScreen: React.FC<Props> = () => {
    const Stack = createNativeStackNavigator()

    return (
        <Stack.Navigator initialRouteName={Routes.CUSTOMERS}>
            <Stack.Screen name={Routes.INBOX} component={InboxScreen} 
                options={{
                    title: 'Inbox',
                }}
            />
            <Stack.Screen name={Routes.CHAT_DETAIL} component={ChatDetail} 
                options={{
                    title: 'Chat',
                }}
            />
        </Stack.Navigator>
    )
}

export const CustomersStackScreen: React.FC<Props> = () => {
    const Stack = createNativeStackNavigator()

    return (
        <Stack.Navigator initialRouteName={Routes.CUSTOMERS}>
            <Stack.Screen name={Routes.CUSTOMERS} component={CustomersScreen} 
                options={{
                    title: 'Customers',
                }}
            />
            <Stack.Screen name={Routes.CUSTOMER_DETAIL} component={CustomerDetailScreen} 
                options={{
                    title: 'Customer',
                }}
             />
            <Stack.Screen name={Routes.ADD_CUSTOMER} component={AddCustomerScreen} 
                options={{
                    title: 'Add Customer',
                }}
             />
        </Stack.Navigator>
    )
}

export const HomeTabNavigator: React.FC<Props> = () => {
    const Tab = createBottomTabNavigator()

    return (
        <Tab.Navigator screenOptions={{ headerShown: false }} >
            <Tab.Screen name={Routes.INBOX_TAB} component={InboxStackScreen}
                options={{
                    title: 'Inbox',
                    tabBarIcon: ({ color }) => (
                        <Image
                        source={require('../assets/Inbox.png')}
                        style={{ width: 20, height: 20, tintColor: color }}
                        />
                    )
                }}
            />
            <Tab.Screen name={Routes.CUSTOMERS_TAB} component={CustomersStackScreen}
                options={{
                    title: 'Customers',
                    tabBarIcon: ({ color }) => (
                        <Image
                        source={require('../assets/Customers.png')}
                        style={{ width: 14, height: 18, tintColor: color }}
                        />
                    )
                }}
            />
        </Tab.Navigator>
        )
    }