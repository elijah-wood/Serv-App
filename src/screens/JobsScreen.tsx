import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { SearchBar } from '@rneui/themed'
import { DeviceEventEmitter, FlatList, RefreshControl } from 'react-native'

import { RootStackParamList } from '../../App'
import UseJobs from '../api/UseJobs'
import { JobRow } from '../components/JobRow'
import { ScrollView } from 'native-base'

type NavigationProp = StackNavigationProp<RootStackParamList, 'JobsScreen'>

type Props = {
  navigation: NavigationProp
}

const JobsScreen: React.FC<Props> = ({ navigation }) => {
  const useJobs = UseJobs()
  const [search, setSearch] = useState("")

  useEffect(() => {
    DeviceEventEmitter.addListener("event.refetchJobs", () => useJobs.refetch() )
    return () => {
      DeviceEventEmitter.removeAllListeners("event.refetchJobs")
    }
  }, [])

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
          placeholder="Search Job Name"
          onChangeText={setSearch}
          value={search}
        />
      <ScrollView         
        refreshControl={
          <RefreshControl refreshing={useJobs.isFetching} onRefresh={() => useJobs.refetch()}/>
        }>
        {useJobs.data.result.filter(job => job.name.toUpperCase().includes(search.toUpperCase())).map((item, index) => (
          <JobRow showBorder={false} job={item} customer={item.Customer} key={index} onPress={() => {
            navigation.navigate('JobDetailScreen', { jobId: item.id })
          }}/>
        ))}     
      </ScrollView>    
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
