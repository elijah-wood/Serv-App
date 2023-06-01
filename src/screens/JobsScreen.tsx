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

const JobsScreen: React.FC<Props> = ({ navigation }) => {
  const useJobs = UseJobs()
  const [search, setSearch] = useState("")
  const [groupedJobs, setGroupedJobs] = useState<{ title: string, data: Job[], hidden: boolean}[]>([{ title: '', data: [], hidden: false}])

  useEffect(() => {
    DeviceEventEmitter.addListener("event.refetchJobs", () => useJobs.refetch() )
    return () => {
      DeviceEventEmitter.removeAllListeners("event.refetchJobs")
    }
  }, [])

  useEffect(() => {
    switch (useJobs.status) {
      case 'success':
        setGroupedJobs(groupByStatus(useJobs.data?.result))
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

  return (
    <ContainerView>
        {/* <SearchBar
          platform="ios"
          placeholder="Search Job Name"
          onChangeText={setSearch}
          value={search}
        /> */}
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
          contentContainerStyle={{flex: 1}}
          ListEmptyComponent={
            <EmptyStateView
              title='Add you first job'
              subtitle='First, go to the Customers tab, add a customer, and then you can add a job in the customer detail screen'
            />
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
