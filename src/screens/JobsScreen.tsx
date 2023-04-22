import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { SearchBar } from '@rneui/themed'
import Icon from 'react-native-vector-icons/Entypo'
import { IconButton } from 'native-base'
import { DeviceEventEmitter, FlatList, RefreshControl } from 'react-native'

import { RootStackParamList } from '../../App'
import UseJobs, { Job } from '../api/UseJobs'
import { JobRow } from '../components/JobRow'

type NavigationProp = StackNavigationProp<RootStackParamList, 'JobsScreen'>

type Props = {
  navigation: NavigationProp
}

const JobsScreen: React.FC<Props> = ({ navigation }) => {
  const useJobs = UseJobs()
  const [search, setSearch] = useState("")
  const [jobsToDisplay, setJobsToDisplay] = useState<Job[]>([])
  const [jobs, setJobs] = useState<Job[]>([])

  useEffect(() => {
    DeviceEventEmitter.addListener("event.refetchJobs", () => { 
      useJobs.refetch()
      console.log("refetch jobs")
    })
    return () => {
      DeviceEventEmitter.removeAllListeners("event.refetchJobs")
    }
  }, [])

  useEffect(() => {
    let filteredArray: Job[] = []
    jobs.forEach(element => filteredArray.push(element))
    setJobsToDisplay(filteredArray)
  }, [])

  useEffect(() => {
    // Only allow jobs to be added from the customer!
    
    // navigation.setOptions({
    //   headerRight: () => (
    //     <IconButton icon={<Icon name='plus' color={'#0062FF'} size={25}/>} onPress={() => {
    //       navigation.navigate('AddJobScreen')
    //     }}/>
    //   ),
    // })
  }, [navigation])

  useEffect(() => {
    switch (useJobs.status) {
      case 'success':
        if (useJobs.data.result) {
          console.log("success jobs")
          setJobs(useJobs.data.result)
          setJobsToDisplay(useJobs.data.result)
        }
        break
      default:
        break
    }
  }, [useJobs.status])

  const updateSearch = (search) => {
    let filteredArray: Job[] = []
    jobs.filter(job => job.name.includes(search.toUpperCase())).forEach(element => filteredArray.push(element))
    setJobsToDisplay(filteredArray)
    setSearch(search)
  }

  if (useJobs.isLoading && jobs.length === 0) {
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
        refreshing={useJobs.isLoading}
        refreshControl={
          <RefreshControl refreshing={useJobs.isLoading} onRefresh={() => useJobs.refetch()}/>
        }
        data={jobsToDisplay}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <JobRow showBorder={false} job={item} customer={item.Customer} onPress={() => {
            navigation.navigate('JobDetailScreen', { jobId: item.id })
          }}/>
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

export default JobsScreen
