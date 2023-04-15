import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'

import Table, { Section, BioCell, StaticCell, KeyValueCell, TouchableCell } from 'react-native-js-tableview'
import { ActivityIndicator, useColorScheme } from 'react-native'
import { HStack } from 'native-base'

import { RootStackParamList } from '../../App'
import { CTAButton } from '../components/CTAButton'
import UseGetCustomer from '../api/UseGetCustomer'
import { Customer } from '../api/UseCustomers'

type NavigationProp = StackNavigationProp<RootStackParamList, 'CustomerDetailScreen'>
type CustomerRouteProp = RouteProp<RootStackParamList, 'CustomerDetailScreen'>

type Props = {
  route: CustomerRouteProp
  navigation: NavigationProp
}

const CustomerDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const useGetCustomer = UseGetCustomer(route.params.customerId)
  const [customer, setCustomer] = useState<Customer>()

  useEffect(() => {
    switch (useGetCustomer.status) {
      case 'success':
        if (useGetCustomer.data.result) {
          setCustomer(useGetCustomer.data.result)
        }
        break
      default:
        break
    }
  }, [useGetCustomer.isLoading])
  
  if (useGetCustomer.isLoading) {
    return (
      <PaddedActivityIndicator/>
    )
  }

  return (
    <ContainerView>
      <Table
          accentColor='#0062FF'
          blendAccent={false}
          mode={'inset-grouped'}
          scrollable={true}>
          <Section>
              <BioCell title={customer?.first_name + ' ' + customer?.last_name} subtitle='Customer' />
          </Section>       
          <HStack space={4} justifyContent={'center'} style={{ marginTop: 16, marginHorizontal: 16}}>
            <CTAButton label='message' icon='message' onPress={() => {
              
            }}/>
            <CTAButton label='call' icon='phone' onPress={() => {
              
            }}/>
          </HStack>
          <Section header='Address' headerStyle={{ color: '#3C3C43' }}>
              <KeyValueCell title={customer?.address?.line1 ?? 'None provided'} accessory="disclosure" onPress={() => {

              }} />
          </Section>
          <Section header='Phone' headerStyle={{ color: '#3C3C43' }}>
              <StaticCell title={customer?.phone} titleStyle={{ color: '#0062FF' }} onPress={() => {

              }} />
          </Section>
          <Section header='Email' headerStyle={{ color: '#3C3C43' }}>
              <StaticCell title={customer?.email} titleStyle={{ color: '#0062FF' }} onPress={() => {

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

const PaddedActivityIndicator = styled.ActivityIndicator`
  padding: 12px;
`

const ContainerView = styled.View`
  background-color: transparent;
  height: 100%;
  width: 100%;
`

export default CustomerDetailScreen
