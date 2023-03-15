import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { AlphabetList, IData } from "react-native-section-alphabet-list";
import { SearchBar } from '@rneui/themed';


import { RootStackParamList } from '../../App'
import { Customer } from '../types/Customer'
import { Job } from '../types/Job'

type NavigationProp = StackNavigationProp<RootStackParamList, 'CustomersScreen'>

type Props = {
  navigation: NavigationProp
}

const CustomersScreen: React.FC<Props> = ({ navigation }) => {
  const [search, setSearch] = useState("")
  const [customerIData, setCustomerIData] = useState<IData[]>([])
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

  React.useEffect(() => {
    let filteredArray: IData[] = []
    customers.forEach(element => filteredArray.push({ key: element.id.toString(), value: element.name}))
    setCustomerIData(filteredArray)
  }, [])

  const updateSearch = (search) => {
    let filteredArray: IData[] = []
    customers.filter(customer => customer.name.toUpperCase().includes(search.toUpperCase())).forEach(element => filteredArray.push({ key: element.id.toString(), value: element.name}))
    setCustomerIData(filteredArray)
    setSearch(search)
  }



  return (
    <ContainerView>
      <SearchBar
        platform="ios"
        placeholder="Search"
        onChangeText={updateSearch}
        value={search}
      />
      <AlphabetList
      data={customerIData}
      indexLetterStyle={{ 
        color: 'black',
      }}
      renderCustomItem={(item) => (
        <Item onPress={() => {
          navigation.navigate("CustomerDetailScreen", { customer: new Customer(0, "Milton Aaron", "m.aaron@gmail.com", "+1 (234) 567-8900", "42 Fleetwood Dr.\nNew York, NY 11280", [
            new Job(0, "Boiler Room Leak", "42 Fleetwood Dr.\nNew York, NY 11280")
          ]) })
        }}><ItemTitle>{item.value}</ItemTitle></Item>
      )}
      renderCustomSectionHeader={(section) => (
        <SectionTitle>{section.title}</SectionTitle>
      )}
    />
    </ContainerView>
  )
}

const ContainerView = styled.View`
  height: 100%;
  width: 100%;
  backgroundColor: white;

`
const Item = styled.TouchableOpacity`
  padding: 10px;
  height: 44px;
`

const ItemTitle = styled.Text`
  fontSize: 18px;
`

const SectionTitle = styled.Text`
  paddingTop: 2px;
  paddingLeft: 10px;
  paddingRight: 10px;
  paddingBottom: 2px;
  fontSize: 14px;
  fontWeight: bold;
  backgroundColor: #E5E5EA;
`

export default CustomersScreen
