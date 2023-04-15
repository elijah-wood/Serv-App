import React, { useCallback, useEffect, useState } from 'react'
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
    navigation.setOptions({
      headerRight: () => (
        <IconButton icon={<Icon name='plus' color={'#0062FF'} size={25}/>} onPress={() => {
          navigation.navigate('AddCustomerScreen')
        }}/>
      ),
    })
  }, [navigation])

  useEffect(() => {
    const updateCustomers = async (customers: Customer[]) => {
      setCustomers(customers)

      const customerDataArray: IData[] = []
      customers.forEach(customer => {
        customerDataArray.push({
          key: customer.id.toString(),
          value: `${customer.first_name} ${customer.last_name}`
        })
      })
      setCustomerIData(customerDataArray)
    }

    switch (useCustomers.status) {
      case 'success':
        if (useCustomers.data.result) {
          updateCustomers(useCustomers.data.result)
        }
        break
      default:
        break
    }
  }, [useCustomers.isLoading])

  const updateSearch = (search) => {
    let filteredArray: IData[] = []
    customers.filter(customer => {
      let fullName = ''
      if (customer.first_name && customer.last_name) {
        fullName = customer.first_name + ' ' + customer.last_name
      }
      
      return fullName.toUpperCase().includes(search.toUpperCase())
    }).forEach(element => filteredArray.push({ key: element.id.toString(), value: element.first_name + ' ' + element.last_name}))

    console.log(filteredArray)
    console.log(search)
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
      style={{height: '100%'}}
      refreshing={useCustomers.isLoading}
      refreshControl={
        <RefreshControl refreshing={useCustomers.isLoading} onRefresh={() => {
          useCustomers.refetch()
        }}/>
      }
      data={customerIData}
      indexLetterStyle={{ 
        color: 'black',
      }}
      renderCustomItem={(item) => (
        <Item onPress={() => {
          navigation.navigate("CustomerDetailScreen", { customerId: item.key })
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
