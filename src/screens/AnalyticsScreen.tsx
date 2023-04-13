import React from 'react'
import styled from 'styled-components/native'
import { StackNavigationProp } from '@react-navigation/stack'

import { RootStackParamList } from '../../App'

type NavigationProp = StackNavigationProp<RootStackParamList, 'AnalyticsScreen'>

type Props = {
  navigation: NavigationProp
}

const AnalyticsScreen: React.FC<Props> = ({ }) => {
  return (
    <ContainerView>
      <ScrollViewWrapper>
        <ScrollView>
        </ScrollView>
      </ScrollViewWrapper>
    </ContainerView>
  )
}

const ContainerView = styled.View`
  background-color: transparent;
  height: 100%;
  width: 100%;
`

const ScrollViewWrapper = styled.SafeAreaView``

const ScrollView = styled.ScrollView``

export default AnalyticsScreen
