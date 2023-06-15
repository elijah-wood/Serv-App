import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { AlphabetList, IData } from 'react-native-section-alphabet-list'
import { SearchBar } from '@rneui/themed'
import Icon from 'react-native-vector-icons/Entypo'
import { IconButton } from 'native-base'
import { RefreshControl, DeviceEventEmitter, Alert } from 'react-native'
import { requestPermissionsAsync, getContactsAsync, PermissionStatus } from 'expo-contacts';

import { RootStackParamList } from '../../App'
import UseCustomers from '../api/UseCustomers'
import { EmptyStateView } from '../components/EmptyStateView'

type NavigationProp = StackNavigationProp<RootStackParamList, 'CustomersScreen'>

type Props = {
  navigation: NavigationProp
}

const CustomersScreen: React.FC<Props> = ({ navigation }) => {
  const useCustomers = UseCustomers()
  const [search, setSearch] = useState("")

  useEffect(() => {
    DeviceEventEmitter.addListener("event.refetchCustomers", () => useCustomers.refetch())
    return () => {
      DeviceEventEmitter.removeAllListeners("event.refetchCustomers")
    }
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

  const syncContacts = async () => {
    const { status } = await requestPermissionsAsync();
    if (status !== PermissionStatus.GRANTED) {
      Alert.alert('Please allow contact access in Settings');
      return;
    }
    const { data } = await getContactsAsync();
    // TODO: remove alert and save contacts
    Alert.alert(`${data.length} contacts imported`);
  };

  if (useCustomers.isLoading) {
    return (
      <ContainerView>
          <PaddedActivityIndicator/>
      </ContainerView>
    )
  }

  return (
    <ContainerView>
      {(!useCustomers.data || !useCustomers.data.result || useCustomers.data?.result.length === 0) ?
        <EmptyStateView
          title='Add your first customer'
          actionTitle='+ Add customer'
          secondaryActionTitle="Sync Contacts"
          onPressAction={() => navigation.navigate('AddCustomerScreen')}
          onPressSecondaryAction={() => syncContacts()}
          /> :
        <>
          <SearchBar
            platform="ios"
            placeholder="Search"
            onChangeText={setSearch}
            value={search}
          />
          <AlphabetList
          style={{height: '100%'}}
          refreshing={useCustomers.isFetching}
          refreshControl={
            <RefreshControl refreshing={useCustomers.isFetching} onRefresh={() => {
              useCustomers.refetch()
            }}/>
          }
          data={useCustomers.data != undefined ? useCustomers.data?.result.map(customer => {
            return {
              key: customer.id.toString(),
              value: `${customer.first_name} ${customer.last_name}`
            }
          }).filter(customer => customer.value.toUpperCase().includes(search.toUpperCase())) : []}
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
        </>
      }
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
