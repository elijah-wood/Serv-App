import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { AlphabetList, IData } from 'react-native-section-alphabet-list'
import { SearchBar } from '@rneui/themed'
import Icon from 'react-native-vector-icons/Entypo'
import { IconButton } from 'native-base'

import { RootStackParamList } from '../../App'
import UseCustomers, { Customer } from '../api/UseCustomers'
import { RefreshControl } from 'react-native'

type NavigationProp = StackNavigationProp<RootStackParamList, 'CustomersScreen'>

type Props = {
  navigation: NavigationProp
}

const CustomersScreen: React.FC<Props> = ({ navigation }) => {
  const useCustomers = UseCustomers()
  const [search, setSearch] = useState("")
  const [customerIData, setCustomerIData] = useState<IData[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])

  useEffect(() => {
    let filteredArray: IData[] = []
    customers.forEach(element => filteredArray.push({ key: element.id.toString(), value: element.first_name + ' ' + element.last_name}))
    setCustomerIData(filteredArray)

    useCustomers.mutate()
  }, [])

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton icon={<Icon name='plus' color={'#0062FF'} size={25}/>} onPress={() => {
          navigation.navigate('AddCustomerScreen')
        }}/>
      ),
    })
  }, [navigation])

  useEffect(() => {
    switch (useCustomers.status) {
      case 'success':
        if (useCustomers.data) {
          setCustomers(useCustomers.data)
        }
        break
      default:
        break
    }
  }, [useCustomers])

  const updateSearch = (search) => {
    let filteredArray: IData[] = []
    customers.filter(customer => {
      (customer.first_name + ' ' + customer.last_name).toUpperCase().includes(search.toUpperCase())
    }).forEach(element => filteredArray.push({ key: element.id.toString(), value: element.first_name + ' ' + element.last_name}))
    setCustomerIData(filteredArray)
    setSearch(search)
  }

  if (useCustomers.isLoading) {
    return (
      <ContainerView>
          <PaddedActivityIndicator/>
      </ContainerView>
    )
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
      refreshControl={
        <RefreshControl refreshing={useCustomers.isLoading} onRefresh={() => {
          useCustomers.mutate()
        }}/>
      }
      data={customerIData}
      indexLetterStyle={{ 
        color: 'black',
      }}
      renderCustomItem={(item) => (
        <Item onPress={() => {
          let customer = customers[item.key]
          navigation.navigate("CustomerDetailScreen", { customerId: customer.id })
        }}><ItemTitle>{item.value}</ItemTitle></Item>
      )}
      renderCustomSectionHeader={(section) => (
        <SectionTitle>{section.title}</SectionTitle>
      )}
    />
    </ContainerView>
  )
}

const PaddedActivityIndicator = styled.ActivityIndicator`
  padding: 12px;
`

const ContainerView = styled.View`
  height: 100%;
  width: 100%;
  background-color: white;
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
