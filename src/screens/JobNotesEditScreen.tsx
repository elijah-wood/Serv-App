import { RouteProp, useNavigation } from '@react-navigation/native'
import styled from 'styled-components/native'
import React, { useEffect, useState } from 'react'
import { DeviceEventEmitter, Platform, ScrollView } from 'react-native'
import { Item } from 'react-navigation-header-buttons'
import UseUpdateJob from '../api/UseUpdateJob'
import { RootStackParamList } from '../../App'

type JobNotesEditRouteProp = RouteProp<RootStackParamList, 'JobNotesEditScreen'>

type Props = {
  route: JobNotesEditRouteProp
}

const JobNotesEditScreen = (props: Props) => {
  const navigation = useNavigation()
  const { job } = props.route.params
  const useUpdateJob = UseUpdateJob(job.id)
  const [notes, setNotes] = useState(job.notes ?? '')
  const [isSaveButtonDisabled, setSaveButtonDisabled] = useState(false)

  const saveNotes = () => {
    setSaveButtonDisabled(true)
    useUpdateJob.mutate({ notes })
  }

  useEffect(() => {
    switch(useUpdateJob.status) {
      case 'success':
        DeviceEventEmitter.emit("event.refetchSelectedJob")
        navigation.goBack()
      default:
        setSaveButtonDisabled(false)
    }
  }, [useUpdateJob.status])

  useEffect(() => {
    navigation.setOptions({
      headerLeft: Platform.OS === 'ios' ? () => <Item title='Cancel' onPress={() => navigation.goBack()} /> : null,
      headerRight: () => <Item title='Save' disabled={isSaveButtonDisabled} onPress={() => saveNotes()} />
    });
  }, [notes, isSaveButtonDisabled])

  return <ScrollView keyboardDismissMode='interactive' contentContainerStyle={{flex: 1}}>
      <NotesTextInput
        placeholder='Type your notes'
        value={notes}
        onChangeText={setNotes}
        multiline
        autoFocus
      />
    </ScrollView>
}

export default JobNotesEditScreen

const NotesTextInput = styled.TextInput`
  flex: 1;
  text-align-vertical: top;
  padding: 16px;
  background-color: white;
  font-size: 17px;
`