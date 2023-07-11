import React from 'react'
import { Image } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { RootStackParamList } from '../../App'
import CustomersScreen from '../screens/CustomersScreen'
import CustomerDetailScreen from '../screens/CustomerDetailScreen'
import Routes from './Routes'
import InboxScreen from '../screens/InboxScreen'
import ChatDetail from '../screens/ChatDetail'
import AddCustomerScreen from '../screens/AddCustomerScreen'
import JobsScreen from '../screens/JobsScreen'
import JobDetailScreen from '../screens/JobDetailScreen'
import AnalyticsScreen from '../screens/AnalyticsScreen'
import TeamScreen from '../screens/TeamScreen'
import AddJobScreen from '../screens/AddJobScreen'
import InvoiceScreen from '../screens/InvoiceScreen'
import AddMemberScreen from '../screens/AddMemberScreen'
import ImportCustomersScreen from '../screens/ImportCustomersScreen'
import ImportTeamMembersScreen from '../screens/ImportTeamMembersScreen'
import JobNotesEditScreen from '../screens/JobNotesEditScreen'

type NavigationProp = StackNavigationProp<RootStackParamList, 'HomeNavigator'>

type Props = {
  navigation: NavigationProp
}

export const HomeNavigator: React.FC<Props> = () => {
    const Stack = createNativeStackNavigator()

    return (
        <Stack.Navigator initialRouteName={Routes.INBOX_TAB}>
            <Stack.Screen name={Routes.INBOX_TAB} component={HomeTabs} 
                options={{
                    title: 'Messages',
                    headerShown: false,
                }}
            />
            {/* Do not show tab bar on this screen: */}
            <Stack.Screen name={Routes.CHAT_DETAIL} component={ChatDetail} 
                options={{
                    title: 'Chat',
                }}
            />
        </Stack.Navigator>
        )
    }

export const HomeTabs: React.FC<Props> = () => {
    const Tab = createBottomTabNavigator()

    return (
        <Tab.Navigator screenOptions={{
            headerShown: false,
            tabBarHideOnKeyboard: true,
            tabBarActiveTintColor: '#1B45F5',
            tabBarInactiveTintColor: '#999999',
            tabBarStyle: { backgroundColor: 'black'}}}
        >
            <Tab.Screen name={Routes.INBOX} component={InboxScreen}
                options={({
                    title: 'Messages',
                    tabBarIcon: ({ color }) => (
                        <Image
                        source={require('../assets/Inbox.png')}
                        style={{ width: 20, height: 20, tintColor: color }}
                        />
                    ),
                  })}
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
            {/* <Tab.Screen name={Routes.ANALYTICS_TAB} component={AnalyticsStackScreen}
                options={{
                    title: 'Analytics',
                    tabBarIcon: ({ color }) => (
                        <Image
                        source={require('../assets/Analytics.png')}
                        style={{ width: 16, height: 17, tintColor: color }}
                        />
                    )
                }}
            /> */}
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
             <Stack.Screen name={Routes.IMPORT_CUSTOMERS} component={ImportCustomersScreen} 
                options={{
                    title: 'Add Contacts',
                }}
             />
             <Stack.Screen name={Routes.JOB_DETAIL} component={JobDetailScreen} 
                options={{
                    title: 'Job',
                }}
             />
            <Stack.Screen name={Routes.CHAT_DETAIL} component={ChatDetail} 
                options={{
                    title: 'Chat',
                }}
            />
            <Stack.Screen name={Routes.ADD_JOB} component={AddJobScreen} 
                options={{
                    title: 'Create Job',
                }}
             />
             <Stack.Screen name={Routes.CREATE_INVOICE} component={InvoiceScreen}
                 options={{
                    title: 'Invoice',
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
            <Stack.Screen name={Routes.CUSTOMER_DETAIL} component={CustomerDetailScreen} 
                options={{
                    title: 'Customer',
                }}
             />
             <Stack.Screen name={Routes.CREATE_INVOICE} component={InvoiceScreen} 
                options={{
                    title: 'Invoice',
                }}
             />
             <Stack.Screen name={Routes.JOB_NOTES_EDIT_SCREEN} component={JobNotesEditScreen}
                options={{
                    title: 'Edit Notes'
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
            <Stack.Screen name={Routes.ADD_MEMBER} component={AddMemberScreen} 
                options={{
                    title: 'Add Member',
                }}
            />
            <Stack.Screen name={Routes.IMPORT_TEAM_MEMBERS} component={ImportTeamMembersScreen}
                options={{
                    title: 'Add Contacts'
                }}
            />
        </Stack.Navigator>
    )
}