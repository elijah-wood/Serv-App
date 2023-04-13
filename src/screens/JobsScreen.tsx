import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { SearchBar } from '@rneui/themed'
import Icon from 'react-native-vector-icons/Entypo'
import { Avatar, Divider, HStack, IconButton, Spacer, VStack } from 'native-base'

import { RootStackParamList } from '../../App'
import UseJobs, { Job } from '../api/UseJobs'
import { FlatList, TouchableOpacity } from 'react-native'
import { Address, Customer } from '../api/UseCustomers'

type NavigationProp = StackNavigationProp<RootStackParamList, 'JobsScreen'>

type Props = {
  navigation: NavigationProp
}

const JobsScreen: React.FC<Props> = ({ navigation }) => {
  const useJobs = UseJobs()
  const [search, setSearch] = useState("")
  const [jobsToDisplay, setJobsToDisplay] = useState<Job[]>([])
  const [jobs, setJobs] = useState<Job[]>([
    { id: '0', name: 'Boiler Room Leak', status: 'Estimated', Customer: { first_name: 'Mark', last_name: 'Guthas' } as Customer } as Job,
    { id: '1', name: 'Boiler Room Leak', status: 'Estimated', Customer: { first_name: 'Mark', last_name: 'Guthas' } as Customer } as Job,
  ])

  useEffect(() => {
    let filteredArray: Job[] = []
    jobs.forEach(element => filteredArray.push(element))
    setJobsToDisplay(filteredArray)

    useJobs.mutate()
  }, [])

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton icon={<Icon name='plus' color={'#0062FF'} size={25}/>} onPress={() => {
          navigation.navigate('AddJobScreen')
        }}/>
      ),
    })
  }, [navigation])

  useEffect(() => {
    switch (useJobs.status) {
      case 'success':
        if (useJobs.data) {
          setJobs(useJobs.data)
        }
        break
      default:
        break
    }
  }, [setJobs])

  const updateSearch = (search) => {
    let filteredArray: Job[] = []
    jobs.filter(job => job.name.includes(search.toUpperCase())).forEach(element => filteredArray.push(element))
    setJobsToDisplay(filteredArray)
    setSearch(search)
  }

  if (useJobs.isLoading) {
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
      <FlatList
        data={jobsToDisplay}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <JobRow job={item} onPress={() => {
            navigation.navigate('JobDetailScreen', { jobId: item.id })
          }}/>
        )}
      />
    </ContainerView>
  )
}

type JobProps = {
    job: Job
    onPress: () => void
}

const JobRow: React.FC<JobProps> = ({
...props
}) => {

return (
    <JobContainerView>
        <TouchableOpacity onPress={props.onPress}>
        <VStack space={5}>
            <HStack space={2}>
                <JobFlexFillWidth>
                    <JobTitle>{props.job.name}</JobTitle>            
                    <JobSubtitle>{props.job.Customer.first_name + ' ' + props.job.Customer.last_name}</JobSubtitle>
                    <JobSubtitle>{props.job.address}</JobSubtitle>
                    <JobBoldSubtitle>{props.job.status + ' • ' + 'You & Maria'}</JobBoldSubtitle>
                </JobFlexFillWidth>
                <Avatar>
                    {}
                </Avatar>
            </HStack>
            <Divider/>
        </VStack>
        </TouchableOpacity>
    </JobContainerView>
)
}

const JobFlexFillWidth = styled.View`
  flex: 1;
  width: 100%;
`

const JobContainerView = styled.View`
  width: 100%;
  padding-horizontal: 15px;
  padding-top: 15px;
`

const JobTitle = styled.Text`
  font-size: 17px;
  font-weight: bold;
  text-align: left;
`

const JobSubtitle = styled.Text`
  font-size: 15px;
  text-align: left;
`

const JobBoldSubtitle = styled.Text`
  font-size: 15px;
  text-align: left;
  font-weight: bold;
`

const PaddedActivityIndicator = styled.ActivityIndicator`
  padding: 12px;
`

const ContainerView = styled.View`
  height: 100%;
  width: 100%;
  background-color: white;
`

export default JobsScreen
