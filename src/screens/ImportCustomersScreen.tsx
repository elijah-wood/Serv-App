import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { View } from 'react-native'
import { RootStackParamList } from '../../App'

type NavigationProp = StackNavigationProp<RootStackParamList, 'ImportCustomersScreen'>

type Props = {
  navigation: NavigationProp
}

const ImportCustomersScreen = () => {
	return <View />
}

export default ImportCustomersScreen