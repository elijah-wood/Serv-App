import React, { useState } from 'react'
import styled from 'styled-components/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../../App'

import Table, { Section, BioCell, StaticCell, TouchableCell } from 'react-native-js-tableview';

type NavigationProp = StackNavigationProp<RootStackParamList, 'CustomerDetailScreen'>

type Props = {
  navigation: NavigationProp
}

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const [customer, setCustomer] = useState<string>("")

  return (
    <ContainerView>
      <ScrollViewWrapper>
        <ScrollView>
            <Table accentColor='#4DB6AC' scrollable={true}>
                <Section header='GENERAL' footer='Lorem ipsum dolor sit amet, consectetur adipiscing elit.'>
                    <BioCell title='Adam Smith' subtitle='Scottish economist, philosopher, and author.' />
                    <StaticCell title='Profile' accessory='disclosure' onPress={() => {}} />
                    <StaticCell title='Books' accessory='disclosure' onPress={() => {}} />
                    <StaticCell title='Projects' accessory='disclosure' onPress={() => {}} />
                </Section>
                <Section>
                    <TouchableCell title='Sign out' onPress={() => {}} />
                </Section>
            </Table>
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

export default WelcomeScreen
