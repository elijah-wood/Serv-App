import React from 'react'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../../App'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CustomersScreen from '../screens/CustomersScreen'
import CustomerDetailScreen from '../screens/CustomerDetailScreen';
import Routes from './Routes';

type NavigationProp = StackNavigationProp<RootStackParamList, 'HomeTabNavigator'>

type Props = {
  navigation: NavigationProp
}

export const CustomersStackScreen: React.FC<Props> = () => {
    const CustomerStack = createNativeStackNavigator()

    return (
        <CustomerStack.Navigator initialRouteName={Routes.CUSTOMERS}>
            <CustomerStack.Screen name={Routes.CUSTOMERS} component={CustomersScreen} 
            options={{
                title: 'Customers',
                }}/>
            <CustomerStack.Screen name={Routes.CUSTOMER_DETAIL} component={CustomerDetailScreen} 
            options={{
                title: 'Customer',
                }}/>
        </CustomerStack.Navigator>
    );
}

export const HomeTabNavigator: React.FC<Props> = () => {
    const Tab = createBottomTabNavigator()

    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name={Routes.CUSTOMERS_TAB} component={CustomersStackScreen}
            options={{
                title: 'Customers',
                }}/>
        </Tab.Navigator>
        )
    }