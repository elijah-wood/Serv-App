import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { SearchBar } from '@rneui/themed'
import { DeviceEventEmitter, RefreshControl, Animated, SectionListData, SectionList } from 'react-native'
import { HStack, Spacer } from 'native-base'

import { RootStackParamList } from '../../App'
import UseJobs, { Job } from '../api/UseJobs'
import { JobRow } from '../components/JobRow'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { EmptyStateView } from '../components/EmptyStateView'

type NavigationProp = StackNavigationProp<RootStackParamList, 'JobsScreen'>

type Props = {
  navigation: NavigationProp
}

const searchJob = (job: Job, search: string) => {
  if (search.trim() === '') {
    return true
  }
  const searchString = search.trim().toLowerCase()
  if (job.name.toLowerCase().includes(searchString)) {
    return true;
  }
  if (job.Customer.first_name?.toLowerCase().includes(searchString)) {
    return true;
  }
  if (job.Customer.last_name?.toLowerCase().includes(searchString)) {
    return true;
  }
  return false;
}

const JobsScreen: React.FC<Props> = ({ navigation }) => {
  const useJobs = UseJobs()
  const [search, setSearch] = useState("")
  const [jobs, setJobs] = useState<Job[]>(null);

  useEffect(() => {
    DeviceEventEmitter.addListener("event.refetchJobs", () => useJobs.refetch() )
    return () => {
      DeviceEventEmitter.removeAllListeners("event.refetchJobs")
    }
  }, [])

  useEffect(() => {
    switch (useJobs.status) {
      case 'success':
        setJobs(useJobs.data?.result)
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
      { title: 'Prospect', data: groups['prospect'] || [], hidden: false },
      { title: 'Estimated', data: groups['estimated'] || [], hidden: false },
      { title: 'Scheduled', data: groups['scheduled'] || [], hidden: false },
      { title: 'Invoiced', data: groups['invoiced'] || [], hidden: false },
      { title: 'Completed', data: groups['completed'] || [], hidden: false },
    ]

    return sortedGroups.filter(group => group.data.length > 0)
  }

  const toggleJobs = (index: number) => {
    // Animated.timing(animatedValue, {
    //   toValue: animatedValue === new Animated.Value(0) ? 1 : 0,
    //   duration: 300,
    //   useNativeDriver: true,
    // }).start(() => {
    //   const newData = [...groupedJobs]
    //   newData[index].hidden = !newData[index].hidden
    //   setGroupedJobs(newData)
    // })
  }

  const renderSectionHeader = ({ section }: { section: SectionListData<Job> }) => {
    const jobCount = section.data.length
    const status = section.title

    return (
      <TouchableOpacity onPress={() => toggleJobs(section.index)}>
        <SectionHeaderContainer>
          <HStack>
            <GroupStatus>{status}</GroupStatus>
            <Spacer/>
            <GroupStatus>{`${jobCount}`}</GroupStatus>
          </HStack>
        </SectionHeaderContainer>
      </TouchableOpacity>
    )
  }

  const renderItem = ({ item }: { item: Job }) => {
    return (
      <JobRow showBorder={false} job={item} customer={item.Customer} key={item.id} onPress={() => {
        navigation.navigate('JobDetailScreen', { jobId: item.id })
      }}/>
    )
  }

  if (useJobs.isLoading) {
    return (
      <ContainerView>
          <PaddedActivityIndicator/>
      </ContainerView>
    )
  }

  const searchedJobs = jobs?.filter((job) => searchJob(job, search))
  const groupedJobs = groupByStatus(searchedJobs ?? [])

  return (
    <ContainerView>
       {jobs?.length > 0 ? <SearchBar
          platform="ios"
          placeholder="Search By Job Name Or Customer"
          onChangeText={setSearch}
          value={search}
        /> : null} 
        <SectionList
          refreshControl={
            <RefreshControl refreshing={useJobs.isFetching} onRefresh={() => useJobs.refetch()}/>
          }
          refreshing={useJobs.isFetching}
          sections={groupedJobs}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled={true}
          contentContainerStyle={{flexGrow: 1}}
          ListEmptyComponent={
            search === '' ? <EmptyStateView
              title='Add your first job'
              subtitle='You can add a job directly from the Customers tab.'
            />: null
          }
        />
    </ContainerView>
  )
}

const SectionHeaderContainer = styled.View`
  background: white;
`

const GroupStatus = styled.Text`
  font-size: 21px;
  font-weight: bold;
  color: #007AFF;
  padding-top: 16px;
  padding-horizontal: 16px;
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
