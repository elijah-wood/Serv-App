import React from 'react'
import styled from 'styled-components/native'
import { StackNavigationProp } from '@react-navigation/stack'

import { useColorScheme } from 'react-native';
import { HStack, VStack } from 'native-base'

import { RootStackParamList } from '../../App'
import { CTAButton } from '../components/CTAButton';
import DefaultButton from '../components/DefaultButton';

type NavigationProp = StackNavigationProp<RootStackParamList, 'AddCustomerScreen'>

type Props = {
  navigation: NavigationProp
}

const AddCustomerScreen: React.FC<Props> = ({ navigation }) => {
  const scheme = useColorScheme()

  return (
    <ContainerView>
      <VStack space={5}>
        <DefaultButton label='Add new customer'/>
      </VStack>
    </ContainerView>
  )
}

const ContainerView = styled.View`
  background-color: transparent;
  height: 100%;
  width: 100%;
`

export default AddCustomerScreen
