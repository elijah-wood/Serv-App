import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'

import Table, { Section, BioCell, StaticCell, KeyValueCell, TouchableCell } from 'react-native-js-tableview'
import { ActivityIndicator } from 'react-native'
import { HStack } from 'native-base'

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
      {/* <Table
          accentColor='#0062FF'
          blendAccent={false}
          mode={'inset-grouped'}
          scrollable={true}>
          <Section>
              <BioCell title={job.Customer.first_name + ' ' + job.Customer.last_name} subtitle='Customer' />
          </Section>       
          <HStack space={4} justifyContent={'center'} style={{ marginTop: 16, marginHorizontal: 16}}>
            <CTAButton label='message' icon='message' onPress={() => {
              
            }}/>
            <CTAButton label='call' icon='phone' onPress={() => {
              
            }}/>
          </HStack>
          <Section header='Address' headerStyle={{ color: '#3C3C43' }}>
              <KeyValueCell title={job.Customer.address.line1} accessory="disclosure" onPress={() => {

              }} />
          </Section>
          <Section>
            <StaticCell title='Jobs' accessory='disclosure' onPress={() => {}} />
            <StaticCell title='Payments' accessory='disclosure' onPress={() => {}} />
          </Section>
      </Table> */}
    </ContainerView>
  )
}

const PaddedActivityIndicator = styled.ActivityIndicator`
  padding: 12px;
`

const ContainerView = styled.View`
  background-color: transparent;
  height: 100%;
  width: 100%;
`

export default JobDetailScreen
