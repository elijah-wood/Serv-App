import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { FlatList, HStack, Spacer, VStack, View } from 'native-base'
import { ScrollView } from 'react-native-virtualized-view'

import { RootStackParamList } from '../../App'
import UseGetJob from '../api/UseGetJob'
import { Job } from '../api/UseJobs'
import { renderAddress } from '../utils/RenderAddress'
import { openMap } from '../utils/OpenMap'
import { DetailSection, SectionContainer, SectionTitle } from '../components/DetailSection'
import { renderCustomerFullName } from '../utils/RenderCustomerFullName'
import DefaultButton from '../components/DefaultButton'
import { MapButton } from '../components/MapButton'

type NavigationProp = StackNavigationProp<RootStackParamList, 'JobDetailScreen'>
type JobRouteProp = RouteProp<RootStackParamList, 'JobDetailScreen'>

type Props = {
  route: JobRouteProp
  navigation: NavigationProp
}

const JobDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const useGetJob = UseGetJob(route.params.jobId)
  const [job, setJob] = useState<Job>()

  useEffect(() => {
    switch (useGetJob.status) {
      case 'success':
        if (useGetJob.data.result) {
          setJob(useGetJob.data.result)
        }
        break
      default:
        break
    }
  }, [useGetJob])
  
  if (useGetJob.isFetching) {
    return (
      <PaddedActivityIndicator/>
    )
  }

  return (
    <ContainerView>
      <ScrollView>
        <VStack space={4}>
          <TitleText>{job?.name}</TitleText>
          <DetailSection title='Description' value={job?.description ?? ''} onPress={() => {
            
          }}/>
          <DetailSection title='Status' value={job?.status ?? ''} showDisclosure={true} onPress={() => {
            
          }}/>
          <DetailSection title='Customer' value={renderCustomerFullName(job?.Customer)} color={'#0062FF'} onPress={() => {
            navigation.navigate('CustomerDetailScreen', { customerId: job?.customer_id })
          }}/>
          {/* Invoices */}
          <SectionContainer>
            <SectionTitle>Invoices</SectionTitle>
            <InvoiceListContainer>
              <FlatList
                  data={job?.Invoice}
                  keyExtractor={(item) => item.id}
                  ItemSeparatorComponent={() => <View style={{height: 16}}/>}
                  renderItem={({ item }) => (
                    <TitleText>{item.id}</TitleText>
                  )}
                />
                <DefaultButton label='+ New Estimate / Invoice'/>
            </InvoiceListContainer>
          </SectionContainer>
          <DetailSection title='Address' value={renderAddress(job?.address)} customRightComponent={
              <MapButton/>
          } onPress={() => {
            openMap(job?.address)
          }}/>
          {/* Collaborators */}
          <SectionContainer>
            <SectionTitle>Collaborators</SectionTitle>
            <InvoiceListContainer>
              {/* <FlatList
                  data={job?.Team.User}
                  keyExtractor={(item) => item.id}
                  ItemSeparatorComponent={() => <View style={{height: 16}}/>}
                  renderItem={({ item }) => (
                    <TitleText>{item.id}</TitleText>
                  )}
                /> */}
                <DefaultButton label='Add Member'/>
            </InvoiceListContainer>
          </SectionContainer>
          <Spacer/>
        </VStack>
      </ScrollView>
    </ContainerView>
  )
}

const InvoiceListContainer = styled.View`
  padding: 16px;
`

const PaddedActivityIndicator = styled.ActivityIndicator`
  padding: 12px;
`

const TitleText = styled.Text`
  font-size: 21px;
  font-weight: bold;
  padding-left: 16px;
  padding-top: 16px;
`

const ContainerView = styled.View`
  background-color: transparent;
  height: 100%;
  width: 100%;
`

export default JobDetailScreen
