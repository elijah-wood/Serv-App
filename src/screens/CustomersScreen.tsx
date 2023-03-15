import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { StatusBar } from 'react-native'
import { RootStackParamList } from '../../App'

import Table, { TouchableCell, Section } from 'react-native-js-tableview';
import { Customer } from '../types/Customer'
import { Job } from '../types/Job'

type NavigationProp = StackNavigationProp<RootStackParamList, 'CustomersScreen'>

type Props = {
  navigation: NavigationProp
}

const CustomersScreen: React.FC<Props> = ({ navigation }) => {
  const [customers, setCustomers] = useState<Customer[]>(
    [
      new Customer(0, "Milton Aaron", "m.aaron@gmail.com", "+1 (234) 567-8900", "42 Fleetwood Dr.\nNew York, NY 11280", [
        new Job(0, "Boiler Room Leak", "42 Fleetwood Dr.\nNew York, NY 11280")
      ]),
      new Customer(1, "Reid Alex", "r.alex@gmail.com", "+1 (234) 567-8900", "42 Fleetwood Dr.\nNew York, NY 11280", []),
      new Customer(2, "Will Baarda", "w.baarda@gmail.com", "+1 (234) 567-8900", "42 Fleetwood Dr.\nNew York, NY 11280", []),
      new Customer(3, "Bruce Ballard", "b.ballard@gmail.com", "+1 (234) 567-8900", "42 Fleetwood Dr.\nNew York, NY 11280", []),
      new Customer(4, "Pauline Banister", "p.banister@gmail.com", "+1 (234) 567-8900", "42 Fleetwood Dr.\nNew York, NY 11280", []),
      new Customer(5, "Michael Barlow", "m.barlow@gmail.com", "+1 (234) 567-8900", "42 Fleetwood Dr.\nNew York, NY 11280", []),
      new Customer(6, "Alex Bartley", "a.bartley@gmail.com", "+1 (234) 567-8900", "42 Fleetwood Dr.\nNew York, NY 11280", []),
      new Customer(7, "Nick Batchelder", "n.batchelder@gmail.com", "+1 (234) 567-8900", "42 Fleetwood Dr.\nNew York, NY 11280", []),
    ]
  )
  
  return (
    <ContainerView>
      <SafeAreaView>
          <Table accentColor='#000000' scrollable={true}>
            <Section>
            {customers.map(customer => {
              return (
                <TouchableCell
                title={`${customer.name}`}
                onPress={() => {
                  navigation.navigate('CustomerDetailScreen', { customer: customer })
                }}
                key={`${customer.id}`}
                />
              )
            })}  
            </Section>
          </Table>
      </SafeAreaView>
    </ContainerView>
  )
}

const ContainerView = styled.View`
  background-color: transparent;
  height: 100%;
  width: 100%;
`

const SafeAreaView = styled.SafeAreaView``

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

const HeaderImage = styled.Image`
  resize-mode: contain;
  width: 300px;
  height: 200px;
  margin-top: ${StatusBar.currentHeight ?? 0}px;
`

const TitleText = styled.Text`
  color: white;
  font-size: 24px;
  font-family: 'BeVietnam-Bold';
  text-align: center;
  margin-top: 18px;
`

const NextButtonContainerView = styled.View`
  position: absolute;
  flex: 1;
  align-items: center;
  left: 0px;
  right: 0px;
  bottom: 44px;
`

export default CustomersScreen
