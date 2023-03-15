import React, { useState } from 'react'
import styled from 'styled-components/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../../App'

import Table, { Section, BioCell, StaticCell, TouchableCell } from 'react-native-js-tableview';

type OnboardingSlideGoalsNavigationProp = StackNavigationProp<RootStackParamList, 'InboxScreen'>

type Props = {
  navigation: OnboardingSlideGoalsNavigationProp
}

const InboxScreen: React.FC<Props> = ({ navigation }) => {
  const [customer, setCustomer] = useState<string>("")

  return (
    <ContainerView>
     
    </ContainerView>
  )
}

const ContainerView = styled.View`
  background-color: transparent;
  height: 100%;
  width: 100%;
`

export default InboxScreen
