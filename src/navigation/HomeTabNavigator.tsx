import React from 'react'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../../App'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CustomersScreen from '../screens/CustomersScreen'
import CustomerDetailScreen from '../screens/CustomerDetailScreen';
import Routes from './Routes';
import InboxScreen from '../screens/InboxScreen';

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
                }}/>
        </Stack.Navigator>
    );
}

export const CustomersStackScreen: React.FC<Props> = () => {
    const Stack = createNativeStackNavigator()

    return (
        <Stack.Navigator initialRouteName={Routes.CUSTOMERS}>
            <Stack.Screen name={Routes.CUSTOMERS} component={CustomersScreen} 
            options={{
                title: 'Customers',
                }}/>
            <Stack.Screen name={Routes.CUSTOMER_DETAIL} component={CustomerDetailScreen} 
            options={{
                title: 'Customer',
                }}/>
        </Stack.Navigator>
    );
}

export const HomeTabNavigator: React.FC<Props> = () => {
    const Tab = createBottomTabNavigator()

    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name={Routes.INBOX_TAB} component={InboxStackScreen}
            options={{
                title: 'Inbox',
                }}/>
            <Tab.Screen name={Routes.CUSTOMERS_TAB} component={CustomersStackScreen}
            options={{
                title: 'Customers',
                }}/>
        </Tab.Navigator>
        )
    }