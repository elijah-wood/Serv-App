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
import JobsScreen from '../screens/JobsScreen'
import JobDetailScreen from '../screens/JobsDetailScreen'
import AnalyticsScreen from '../screens/AnalyticsScreen'
import TeamScreen from '../screens/TeamScreen'
import AddJobScreen from '../screens/AddJobScreen'

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
                    title: 'Messages',
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

export const JobsStackScreen: React.FC<Props> = () => {
    const Stack = createNativeStackNavigator()

    return (
        <Stack.Navigator initialRouteName={Routes.JOBS}>
            <Stack.Screen name={Routes.JOBS} component={JobsScreen} 
                options={{
                    title: 'Jobs',
                }}
            />
            <Stack.Screen name={Routes.JOB_DETAIL} component={JobDetailScreen} 
                options={{
                    title: 'Job',
                }}
             />
            <Stack.Screen name={Routes.ADD_JOB} component={AddJobScreen} 
                options={{
                    title: 'Create Job',
                }}
             />
        </Stack.Navigator>
    )
}

export const AnalyticsStackScreen: React.FC<Props> = () => {
    const Stack = createNativeStackNavigator()

    return (
        <Stack.Navigator initialRouteName={Routes.ANALYTICS}>
            <Stack.Screen name={Routes.ANALYTICS} component={AnalyticsScreen} 
                options={{
                    title: 'Analytics',
                }}
            />
        </Stack.Navigator>
    )
}

export const TeamStackScreen: React.FC<Props> = () => {
    const Stack = createNativeStackNavigator()

    return (
        <Stack.Navigator initialRouteName={Routes.TEAM}>
            <Stack.Screen name={Routes.TEAM} component={TeamScreen} 
                options={{
                    title: 'Team',
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
            <Tab.Screen name={Routes.JOBS_TAB} component={JobsStackScreen}
                options={{
                    title: 'Jobs',
                    tabBarIcon: ({ color }) => (
                        <Image
                        source={require('../assets/Jobs.png')}
                        style={{ width: 20, height: 18, tintColor: color }}
                        />
                    )
                }}
            />
            <Tab.Screen name={Routes.ANALYTICS_TAB} component={AnalyticsStackScreen}
                options={{
                    title: 'Analytics',
                    tabBarIcon: ({ color }) => (
                        <Image
                        source={require('../assets/Analytics.png')}
                        style={{ width: 16, height: 17, tintColor: color }}
                        />
                    )
                }}
            />
            <Tab.Screen name={Routes.TEAM_TAB} component={TeamStackScreen}
                options={{
                    title: 'Team',
                    tabBarIcon: ({ color }) => (
                        <Image
                        source={require('../assets/Team.png')}
                        style={{ width: 20, height: 20, tintColor: color }}
                        />
                    )
                }}
            />
        </Tab.Navigator>
        )
    }