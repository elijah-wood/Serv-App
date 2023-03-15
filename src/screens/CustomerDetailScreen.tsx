import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp, DefaultTheme, DarkTheme } from '@react-navigation/native'

import Icon from 'react-native-vector-icons/Entypo';
import Table, { Section, BioCell, StaticCell, TouchableCell, KeyValueCell } from 'react-native-js-tableview';
import { Platform, useColorScheme } from 'react-native';

import { RootStackParamList } from '../../App'
import { Customer } from '../types/Customer';

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
              <StaticCell title='Message' accessory='disclosure' onPress={() => {

              }} />
              <KeyValueCell title={customer.phone} iconComponent={
                <Icon name="phone" size={20} color="#0062FF" />
              } onPress={() => {

              }} />
              <KeyValueCell title={customer.email} iconComponent={
                <Icon name="email" size={20} color="#0062FF" />
              } onPress={() => {

              }} />
              <KeyValueCell title={customer.address} iconComponent={
                <Icon name="address" size={20} color="#000000" />
              }  onPress={() => {

              }} />
          </Section>
          <Section>
            <StaticCell title='Jobs' accessory='disclosure' onPress={() => {}} />
            <StaticCell title='Payments' accessory='disclosure' onPress={() => {}} />
          </Section>
          <Section>
            <TouchableCell title='Delete'/>
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

const ScrollView = styled.ScrollView``

const VStackContainerView = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: center;
`
// Button bottom constraint + button height + goal margin
const GoalsVStackContainerView = styled.View`
  margin-bottom: ${44 + 50 + 18}px;
`


const TitleText = styled.Text`
  color: white;
  font-size: 24px;
  font-family: 'BeVietnam-Bold';
  text-align: center;
  margin-top: 18px;
`

export default CustomerDetailScreen
