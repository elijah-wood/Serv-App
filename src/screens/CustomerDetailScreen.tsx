import React from 'react'
import styled from 'styled-components/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'

import Table, { Section, BioCell, StaticCell, KeyValueCell } from 'react-native-js-tableview';
import {useColorScheme } from 'react-native';
import { HStack } from 'native-base'

import { RootStackParamList } from '../../App'
import { CTAButton } from '../components/CTAButton';

type NavigationProp = StackNavigationProp<RootStackParamList, 'CustomerDetailScreen'>
type CustomerRouteProp = RouteProp<RootStackParamList, 'CustomerDetailScreen'>

type Props = {
  route: CustomerRouteProp
  navigation: NavigationProp
}

const CustomerDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { customer } = route.params
  const scheme = useColorScheme()

  return (
    <ContainerView>
      <Table
          accentColor='#0062FF'
          blendAccent={false}
          mode={'inset-grouped'}
          scrollable={true}>
          <Section>
              <BioCell title={customer.name} subtitle='Customer' />
          </Section>       
          <HStack space={4} justifyContent={'center'} style={{ marginTop: 16, marginHorizontal: 16}}>
            <CTAButton label='message' icon='message' onPress={() => {
              
            }}/>
            <CTAButton label='call' icon='phone' onPress={() => {
              
            }}/>
          </HStack>
          <Section header='Address' headerStyle={{ color: '#3C3C43' }}>
              <KeyValueCell title={customer.address} accessory="disclosure" onPress={() => {

              }} />
          </Section>
          <Section header='Phone' headerStyle={{ color: '#3C3C43' }}>
              <StaticCell title={customer.phone} accessory="disclosure" onPress={() => {

              }} />
          </Section>
          <Section header='Email' headerStyle={{ color: '#3C3C43' }}>
              <StaticCell title={customer.email} accessory="disclosure"onPress={() => {

              }} />
          </Section>
          <Section>
            <StaticCell title='Jobs' accessory='disclosure' onPress={() => {}} />
            <StaticCell title='Payments' accessory='disclosure' onPress={() => {}} />
          </Section>
      </Table>
    </ContainerView>
  )
}

const ContainerView = styled.View`
  background-color: transparent;
  height: 100%;
  width: 100%;
`

export default CustomerDetailScreen
