import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { Avatar, ChevronRightIcon, Divider, FlatList, HStack, Spacer, VStack, View } from 'native-base'
import { ScrollView } from 'react-native-virtualized-view'
import { DeviceEventEmitter, TouchableOpacity } from 'react-native'

import { RootStackParamList } from '../../App'
import UseGetJob from '../api/UseGetJob'
import { Job } from '../api/UseJobs'
import { renderAddress } from '../utils/RenderAddress'
import { openMap } from '../utils/OpenMap'
import { DetailSection, SectionContainer, SectionTitle } from '../components/DetailSection'
import { renderCustomerFullName } from '../utils/RenderCustomerFullName'
import DefaultButton from '../components/DefaultButton'
import { MapButton } from '../components/MapButton'
import { getInitials } from '../utils/GetStringInitials'
import { capitalizeFirstLetter } from '../utils/CapitalizeFirstLetter'
import { getUserFromToken } from '../api/Session'
import { Collaborator } from '../api/UseCustomers'

type NavigationProp = StackNavigationProp<RootStackParamList, 'JobDetailScreen'>
type JobRouteProp = RouteProp<RootStackParamList, 'JobDetailScreen'>

type Props = {
  route: JobRouteProp
  navigation: NavigationProp
}

const JobDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const useGetJob = UseGetJob(route.params.jobId)
  const [job, setJob] = useState<Job>()
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])

  useEffect(() => {
    DeviceEventEmitter.addListener("event.refetchInvoices", () => useGetJob.refetch())
    return () => {
      DeviceEventEmitter.removeAllListeners("event.refetchInvoices")
    }
  }, [])

  useEffect(() => {
    const renderCollaborators = async (job: Job) => {
      let user = await getUserFromToken()
      setCollaborators([{ id: '1', Member: { id: '1', User: user }, isYou: true}, ...job.Customer.Collaborator])
    }

    switch (useGetJob.status) {
      case 'success':
        if (useGetJob.data.result) {
          setJob(useGetJob.data.result)
          renderCollaborators(useGetJob.data.result)
        }
        break
      default:
        break
    }
  }, [useGetJob.data])
  
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
          <DetailSection title='Status' value={capitalizeFirstLetter(job?.status ?? '')} showDisclosure={true} onPress={() => {
            
          }}/>
          <DetailSection title='Customer' value={renderCustomerFullName(job?.Customer)} color={'#0062FF'} onPress={() => {
            navigation.navigate('CustomerDetailScreen', { customerId: job?.customer_id })
          }}/>
          {/* Invoices */}
          <SectionContainer>
            <SectionTitle>Invoices</SectionTitle>
            <InlineListContainer>
              <FlatList
                  data={job?.Invoice}
                  keyExtractor={(item) => item.id}
                  ItemSeparatorComponent={() => <View style={{height: 16}}/>}
                  renderItem={({ item }) => (
                    <TitleText>{item.id}</TitleText>
                  )}
                />
                <DefaultButton label='+ New Estimate / Invoice' onPress={() => {
                  navigation.navigate('InvoiceScreen', { job: job })
                }}/>
            </InlineListContainer>
          </SectionContainer>
          <DetailSection title='Address' value={renderAddress(job?.address)} customRightComponent={
              <MapButton/>
          } onPress={() => {
            openMap(job?.address)
          }}/>
          {/* Collaborators */}
          <SectionContainer>
            <SectionTitle>Collaborators</SectionTitle>
            <InlineListContainer>
              <VStack space={collaborators.length > 0 ? 4 : 0}>
                <FlatList
                    data={collaborators}
                    keyExtractor={(item) => item.id}
                    ItemSeparatorComponent={() => <DividerWrapper><Divider/></DividerWrapper>}
                    renderItem={({ item }) => (                      
                      <TouchableOpacity>
                        <HStack alignItems={'center'}>
                          <HStack space={2}>
                            <Avatar>{getInitials(item?.Member.User.first_name + ' ' + item?.Member.User.last_name)}</Avatar>
                            <CollaboratorNameText>{item?.Member.User.first_name + ' ' + item?.Member.User.last_name + (item?.isYou ? ' (you)' : '')}</CollaboratorNameText>
                          </HStack>
                          <Spacer/>
                          <CollaboratorDisclosureContainer>
                              <ChevronRightIcon />
                          </CollaboratorDisclosureContainer>
                        </HStack>
                      </TouchableOpacity>                   
                    )}
                  />
                  <DefaultButton label='Add Member'/>
                </VStack>
            </InlineListContainer>
          </SectionContainer>
          <Spacer/>
        </VStack>
      </ScrollView>
    </ContainerView>
  )
}

const DividerWrapper = styled.View`
  padding-vertical: 12px;
`

const InlineListContainer = styled.View`
  padding: 16px;
`

const PaddedActivityIndicator = styled.ActivityIndicator`
  padding: 12px;
`

const CollaboratorNameText = styled.Text`
  font-size: 17px;
  align-self: center;
`

const CollaboratorDisclosureContainer = styled.View`
  padding-vertical: 16px;
  padding-right: 16px;
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
