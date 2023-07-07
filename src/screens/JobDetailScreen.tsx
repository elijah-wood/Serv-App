import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { Avatar, Box, ChevronRightIcon, Divider, FlatList, Flex, HStack, Spacer, Text, VStack, View } from 'native-base'
import { ScrollView } from 'react-native-virtualized-view'
import { Alert, DeviceEventEmitter, TouchableOpacity } from 'react-native'
import SelectDropdown from 'react-native-select-dropdown'

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
import { Collaborator, Member } from '../api/UseCustomers'
import { InvoiceCell } from '../components/InvoiceCell'
import UseUpdateJob from '../api/UseUpdateJob'
import { InvoiceEstimateType } from './InvoiceScreen'
import UseMembers from '../api/UseMembers'
import { useActionSheet } from '@expo/react-native-action-sheet'
import UseAddCollaborator from '../api/UseAddCollaborator'

type NavigationProp = StackNavigationProp<RootStackParamList, 'JobDetailScreen'>
type JobRouteProp = RouteProp<RootStackParamList, 'JobDetailScreen'>

type Props = {
  route: JobRouteProp
  navigation: NavigationProp
}

const JobDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const useGetJob = UseGetJob(route.params.jobId)
  const useUpdateJob = UseUpdateJob(route.params.jobId)
  const useMembers = UseMembers()
  const useAddCollaborator = UseAddCollaborator()
  const [job, setJob] = useState<Job>()
  const [status, setStatus] = useState('')
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])

  const { showActionSheetWithOptions } = useActionSheet()

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
          setStatus(useGetJob.data.result.status)
          renderCollaborators(useGetJob.data.result)
        }
        break
      default:
        break
    }
  }, [useGetJob.data])

  useEffect(() => {
    switch (useUpdateJob.status) {
      case 'success':
        if (useUpdateJob.data.ok) {
          useGetJob.refetch()
          DeviceEventEmitter.emit("event.refetchJobs")
        }
        break
      default:
        break
    }
  }, [useUpdateJob.data])

  useEffect(() => {
    switch (useAddCollaborator.status) {
      case 'success':
        if (useAddCollaborator.data.ok) {
          useGetJob.refetch()
          DeviceEventEmitter.emit("event.refetchJobs")
        }
        break
      default:
        break
    }
  }, [useAddCollaborator.data])
  
  const data = useMemo(
    () =>
      Array(50)
        .fill(0)
        .map((_, index) => `index-${index}`),
    []
  )

  if (useGetJob.isFetching || useUpdateJob.isLoading || useMembers.isLoading) {
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
          <SelectDropdown
            data={['Prospect', 'Estimated', 'Scheduled', 'Invoiced', 'Completed']}
            onSelect={(selectedItem) => {                
              setStatus(selectedItem.toLowerCase())
              if (job != undefined) {
                useUpdateJob.mutate({ status: selectedItem.toLowerCase() })
              }                
            }}
            renderCustomizedButtonChild={(selectedItem, index) => {
              return (       
                <DetailSection title='Status' value={capitalizeFirstLetter(status ?? '')} showDisclosure={true} disabled={true}/>                    
              )
            }}
            // Height shouldn't be a fixed value here, but this is the only way it will fill right now
            buttonStyle={{ width: '100%', paddingHorizontal: 0, height: 85 }}
          />
          <DetailSection title='Customer' value={renderCustomerFullName(job?.Customer)} color={'#0062FF'} onPress={() => {
            navigation.navigate('CustomerDetailScreen', { customerId: job?.customer_id })
          }}/>
          {/* Invoices & Estimates */}
          <SectionContainer>
            <SectionTitle>Estimates & Invoices</SectionTitle>
            <InlineListContainer>
              <VStack space={(job?.Invoice?.length ?? 0) + (job?.Estimate?.length ?? 0) > 0 ? 4 : 0}>
                {job?.Estimate?.length > 0 && (
                  <FlatList
                    data={job?.Estimate}
                    keyExtractor={(item) => item.id}
                    ItemSeparatorComponent={() => <View style={{ height: 16 }}/>}
                    renderItem={(item) => (                                          
                      <InvoiceCell type={'Estimate'} subtitle={capitalizeFirstLetter(item.item.status)} created_at={item.item.created_at} items={item.item.EstimateItem} onPress={() => {
                        navigation.navigate('InvoiceScreen', { job: job, type: InvoiceEstimateType.Estimate, estimateId: item.item.id, invoiceEstimateItems: item.item.EstimateItem })
                      }}/>
                    )}
                  />
                )}   
                {job?.Invoice?.length > 0 && (   
                  <FlatList
                    data={job?.Invoice}
                    keyExtractor={(item) => item.id}
                    ItemSeparatorComponent={() => <View style={{ height: 16 }}/>}
                    renderItem={(item) => (                    
                      <InvoiceCell type={`Invoice`} subtitle={capitalizeFirstLetter(item.item.status)} created_at={item.item.created_at} items={item.item.InvoiceItem} onPress={() => {
                        navigation.navigate('InvoiceScreen', { job: job, type: InvoiceEstimateType.Invoice, invoiceId: item.item.id, dueDate: item.item.due_date, invoiceEstimateItems: item.item.InvoiceItem })
                      }}/>
                    )}
                  />
                )}    
                <Flex direction='row' justifyContent={'space-between'} style={{ gap: 12 }}>                                                        
                  <Box flex={1}>
                    <DefaultButton label='New Estimate' onPress={() => {
                      navigation.navigate('InvoiceScreen', { job: job, type: InvoiceEstimateType.Estimate })
                    }}/>
                  </Box>                                                    
                  <Box flex={1}>
                    <DefaultButton label='New Invoice' onPress={() => {
                      navigation.navigate('InvoiceScreen', { job: job, type: InvoiceEstimateType.Invoice })
                    }}/>
                  </Box>                                                                                            
                </Flex>                                          
              </VStack>
            </InlineListContainer>
          </SectionContainer>
          <DetailSection title='Address' value={renderAddress(job?.address)} customRightComponent={
              <MapButton/>
          } onPress={() => {
            openMap(job?.address)
          }}/>
          {/* Collaborators */}
          <SectionContainer>
            <SectionTitle>Team Members</SectionTitle>
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
                  
                  <DefaultButton label='Add Team Member' loading={useAddCollaborator.isLoading} onPress={async () => {
                    if (useMembers.data.result.length == 1) {
                      Alert.alert('You have no team members added to your account', 'Go to the Team tab and invite a member first.')
                      return
                    }
                    let user = await getUserFromToken()
                    let options = [...useMembers.data.result.filter(item => item.User.id != user.id).map(item => item.User.first_name + ' ' + item.User.last_name), 'Cancel']
                    let cancelButtonIndex = options.length-1

                    showActionSheetWithOptions({
                      options,
                      cancelButtonIndex
                    }, (selectedIndex: number) => {
                      if (selectedIndex != cancelButtonIndex) {
                        Alert.alert('Coming soon...')
                        //useAddCollaborator.mutate({ member_id: useMembers.data.result[selectedIndex].id, customer_id: job.customer_id})
                      }
                    })              
                  }}/>
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
