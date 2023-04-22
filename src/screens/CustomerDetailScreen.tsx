import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { Avatar, Center, HStack, Spacer, VStack, View } from 'native-base'
import { ScrollView } from 'react-native-virtualized-view'

import { RootStackParamList } from '../../App'
import { CTAButton } from '../components/CTAButton'
import UseGetCustomer from '../api/UseGetCustomer'
import { Customer } from '../api/UseCustomers'
import { openMap } from '../utils/OpenMap'
import { renderAddress } from '../utils/RenderAddress'
import { DeviceEventEmitter, FlatList } from 'react-native'
import { makeCall } from '../utils/MakeCall'
import { composeEmail } from '../utils/ComposeEmail'
import { JobRow } from '../components/JobRow'
import { DetailSection, SectionContainer, SectionTitle, SectionValue } from '../components/DetailSection'
import { getInitials } from '../utils/GetStringInitials'
import { renderCustomerFullName } from '../utils/RenderCustomerFullName'
import { MapButton } from '../components/MapButton'
import DefaultButton from '../components/DefaultButton'
import { Job } from '../api/UseJobs'

type NavigationProp = StackNavigationProp<RootStackParamList, 'CustomerDetailScreen'>
type CustomerRouteProp = RouteProp<RootStackParamList, 'CustomerDetailScreen'>

type Props = {
  route: CustomerRouteProp
  navigation: NavigationProp
}

const CustomerDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const useGetCustomer = UseGetCustomer(route.params.customerId)
  const [customer, setCustomer] = useState<Customer>()
  const [jobs, setJobs] = useState<Job[]>([])

  useEffect(() => {
    DeviceEventEmitter.addListener("event.refetchJobs", () => useGetCustomer.refetch())
    return () => {
      DeviceEventEmitter.removeAllListeners("event.refetchJobs")
    }
  }, [])
  
  useEffect(() => {
    switch (useGetCustomer.status) {
      case 'success':
        if (useGetCustomer.data.result) {
          setCustomer(useGetCustomer.data.result)
          setJobs(useGetCustomer.data.result.Job)
        }
        break
      default:
        break
    }
  }, [useGetCustomer.data])
  
  if (useGetCustomer.isLoading) {
    return (
      <PaddedActivityIndicator/>
    )
  }

  return (
    <ContainerView>
      <ScrollView>
        <VStack space={4}>
          <Center>
            <AvatarContainer>
              <Avatar size={'xl'}>{getInitials(renderCustomerFullName(customer))}</Avatar>
            </AvatarContainer>
            <CustomerName>{renderCustomerFullName(customer)}</CustomerName>
          </Center>
          <HStack space={4} justifyContent={'center'} style={{ marginTop: 16, marginHorizontal: 16}}>
              <CTAButton label='call' icon='phone' onPress={() => {
                makeCall(customer?.phone)
              }}/>
              <CTAButton label='message' icon='message' onPress={() => {
                navigation.navigate('ChatDetail', { conversationSid: customer?.twilio_conversation_sid, name: renderCustomerFullName(customer)})
              }}/>
          </HStack>
          <DetailSection title='Address' value={renderAddress(customer?.address)} customRightComponent={
              <MapButton/>
          } onPress={() => {
            openMap(customer?.address)
          }}/>
          <DetailSection title='Phone' value={customer?.phone ?? ''} color={'#0062FF'} onPress={() => {
            makeCall(customer?.phone)
          }}/>
          <DetailSection title='Email' value={customer?.email ?? ''} color={'#0062FF'} onPress={() => {
            composeEmail(customer?.email)
          }}/>
          {/* Jobs */}
          <SectionContainer>
            <SectionTitle>Jobs</SectionTitle>
            <JobsListContainer>
              <VStack space={jobs.length > 0 ? 4 : 0}>
                <FlatList
                  data={jobs}
                  keyExtractor={(item) => item.id}
                  ItemSeparatorComponent={() => <View style={{height: 16}}/>}
                  renderItem={({ item }) => (
                    <JobRow showBorder={true} job={item} customer={customer} onPress={() => {
                      navigation.navigate('JobDetailScreen', { jobId: item.id })
                    }}/>
                  )}
                />
                <DefaultButton label='Add Job' onPress={() => {
                  navigation.navigate('AddJobScreen', { customerId: route.params.customerId})
                }}/>
              </VStack>
            </JobsListContainer>
          </SectionContainer>
          <Spacer/>
        </VStack>
      </ScrollView>
    </ContainerView>
  )
}

const JobsListContainer = styled.View`
  padding: 16px;
`

const AvatarContainer = styled.View`
  padding: 16px;
`

const CustomerName = styled.Text`
  font-weight: bold;
  font-size: 28px;
`

const PaddedActivityIndicator = styled.ActivityIndicator`
  padding: 12px;
`

const ContainerView = styled.View`
  background-color: transparent;
  height: 100%;
  width: 100%;
`

export default CustomerDetailScreen
