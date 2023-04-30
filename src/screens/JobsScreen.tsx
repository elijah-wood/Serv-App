import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { SearchBar } from '@rneui/themed'
import { DeviceEventEmitter, FlatList, RefreshControl, Animated } from 'react-native'
import { HStack, Spacer, View } from 'native-base'
import { ScrollView } from 'react-native-virtualized-view'

import { RootStackParamList } from '../../App'
import UseJobs, { Job } from '../api/UseJobs'
import { JobRow } from '../components/JobRow'
import { TouchableOpacity } from 'react-native-gesture-handler'

type NavigationProp = StackNavigationProp<RootStackParamList, 'JobsScreen'>

type Props = {
  navigation: NavigationProp
}

const JobsScreen: React.FC<Props> = ({ navigation }) => {
  const useJobs = UseJobs()
  const [search, setSearch] = useState("")
  const [groupedJobs, setGroupedJobs] = useState<{ status: string, jobs: Job[]}[]>()

  useEffect(() => {
    DeviceEventEmitter.addListener("event.refetchJobs", () => useJobs.refetch() )
    return () => {
      DeviceEventEmitter.removeAllListeners("event.refetchJobs")
    }
  }, [])

  useEffect(() => {
    switch (useJobs.status) {
      case 'success':
        setGroupedJobs(groupByStatus(useJobs.data.result))
        break
      default:
        break
    }
  }, [useJobs.data])

  const groupByStatus = (data: Job[]) => {
    const groups = data.reduce((groups, job) => {
      const { status } = job
      if (!groups[status]) {
        groups[status] = []
      }
      groups[status].push(job)
      return groups
    }, {} as Record<string, Job[]>)
  
    const sortedGroups = [
      { status: 'Prospect', jobs: groups['prospect'] || [] },
      { status: 'Estimated', jobs: groups['estimated'] || [] },
      { status: 'Scheduled', jobs: groups['scheduled'] || [] },
      { status: 'Invoice Sent', jobs: groups['invoiced'] || [] },
      { status: 'Completed', jobs: groups['completed'] || [] },
    ]
  
    return sortedGroups.filter(group => group.jobs.length > 0)
  }

  if (useJobs.isLoading) {
    return (
      <ContainerView>
          <PaddedActivityIndicator/>
      </ContainerView>
    )
  }

  const renderStatusGroup = ({ item }: { item: { status: string, jobs: Job[] } }) => (
    <View>
      <TouchableOpacity>
        <HStack>
          <GroupStatus>{item.status}</GroupStatus>
          <Spacer/>
          <GroupStatusJobCount>{`${item.jobs.length}`}</GroupStatusJobCount>
        </HStack>
      </TouchableOpacity>    
      <FlatList
        data={item.jobs}
        keyExtractor={(job) => job.id}
        renderItem={({ item }) => (
          <JobRow showBorder={false} job={item} customer={item.Customer} key={item.id} onPress={() => {
            navigation.navigate('JobDetailScreen', { jobId: item.id })
          }}/>
        )}
      />
    </View>
  )

  return (
    <ContainerView>
        <SearchBar
          platform="ios"
          placeholder="Search Job Name"
          onChangeText={setSearch}
          value={search}
        />
      <ScrollView         
        refreshControl={
          <RefreshControl refreshing={useJobs.isFetching} onRefresh={() => useJobs.refetch()}/>
        }>
          <FlatList
            data={groupedJobs}
            keyExtractor={(item) => item.status}
            renderItem={renderStatusGroup}
          />
      </ScrollView>    
    </ContainerView>
  )
}

const GroupStatus = styled.Text`
  font-size: 21px;
  font-weight: bold;
  color: #007AFF;
  padding-top: 15px;
  padding-horizontal: 15px;
`

const GroupStatusJobCount = styled.Text`
  font-size: 21px;
  font-weight: bold;
  color: #007AFF;
  padding-top: 15px;
  padding-horizontal: 15px;
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
