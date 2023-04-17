import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'

import Table, { Section, BioCell, StaticCell, KeyValueCell, TouchableCell } from 'react-native-js-tableview'
import { ActivityIndicator } from 'react-native'
import { VStack } from 'native-base'

import { RootStackParamList } from '../../App'
import { CTAButton } from '../components/CTAButton'
import UseGetJob from '../api/UseGetJob'
import { Job } from '../api/UseJobs'

type NavigationProp = StackNavigationProp<RootStackParamList, 'JobDetailScreen'>
type CustomerRouteProp = RouteProp<RootStackParamList, 'JobDetailScreen'>

type Props = {
  route: CustomerRouteProp
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
  
  if (useGetJob.isLoading) {
    return (
      <PaddedActivityIndicator/>
    )
  }

  return (
    <ContainerView>
      <VStack> 
        <TitleText>{job?.name}</TitleText>
        <Table
          accentColor='#0062FF'
          blendAccent={false}
          mode={'inset-grouped'}
          scrollable={true}>  
          <Section header='Description' headerStyle={{ color: '#3C3C43' }}>
              <KeyValueCell title={job?.description ?? ''} />
          </Section>
          <Section header='Status' headerStyle={{ color: '#3C3C43' }} >
              <KeyValueCell title={job?.status ?? ''} accessory="disclosure" onPress={() => {

              }} />
          </Section>
          <Section header='Customer' headerStyle={{ color: '#3C3C43' }}>
              <KeyValueCell title={(job?.Customer?.first_name ?? '') + ' ' + (job?.Customer?.last_name ?? '')} />
          </Section>
          <Section header='Address' headerStyle={{ color: '#3C3C43' }}>
              <KeyValueCell title={job?.address?.line1 ?? 'Not provided'} accessory="disclosure" onPress={() => {

              }} />
          </Section>
          <Section>
            <StaticCell title='Invoices' accessory='disclosure' onPress={() => {}} />
          </Section>
          <Section>
            <StaticCell title='Photos' accessory='disclosure' onPress={() => {}} />
          </Section>
          <Section>
            <StaticCell title='Collaborators' accessory='disclosure' onPress={() => {}} />
          </Section>
          <Section>
            <TouchableCell title='Delete'/>
          </Section>
        </Table>
      </VStack>
    </ContainerView>
  )
}

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
