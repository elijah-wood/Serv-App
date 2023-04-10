import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import styled from 'styled-components/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { SearchBar } from '@rneui/themed'
import { Alert, FlatList } from 'react-native'
import { Avatar, Divider, HStack, Icon, IconButton, Spacer, VStack } from 'native-base'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { RootStackParamList } from '../../App'
import { TwilioService } from '../twilio/TwilioService'
import { getUserSession, removeUserSession } from '../api/Session'

type OnboardingSlideGoalsNavigationProp = StackNavigationProp<RootStackParamList, 'InboxScreen'>

type Props = {
  navigation: OnboardingSlideGoalsNavigationProp
}

export class Channel {
  id: string
  name: string
  time: string
  lastMessage: string
  isUnread: boolean
  isOnline: boolean

  constructor (id: string, name: string, time: string, lastMessage: string, isUnread: boolean, isOnline: boolean) {
    this.id = id
    this.name = name
    this.time = time
    this.lastMessage = lastMessage
    this.isUnread = isUnread
    this.isOnline = isOnline
  }
}

const InboxScreen: React.FC<Props> = ({ navigation }) => {
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [channels, setChannels] = useState<Channel[]>([
    new Channel("0", "Nicole Benevo", "9:37pm", "I will be available from 3-5pm", true, false),
    new Channel("1", "Maria Seere", "9:02pm", "Spoke to customer. Will be there soon. I will be available from 3-5pm", false, true)
  ])
  const [channelsToDisplay, setChannelsToDisplay] = useState<Channel[]>([])

  React.useEffect(() => {
    let filteredArray: Channel[] = []
    channels.forEach(element => filteredArray.push(element))
    setChannelsToDisplay(filteredArray)
  }, [])

  // if (!clientIsReady) {
  //   return <WarningText>Loading chat ...</WarningText>
  // } 

  const updateSearch = (search) => {
    let filteredArray: Channel[] = []
    channels.filter(channel => channel.name.toUpperCase().includes(search.toUpperCase())).forEach(element => filteredArray.push(element))
    setChannelsToDisplay(filteredArray)
    setSearch(search)
  }

  // TWILIO
  const channelPaginator = useRef()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton icon={<Icon name='plus' color={'#0062FF'} size={25}/>} onPress={() => {
          navigation.navigate('AddCustomerScreen')
        }}/>
      ),
    })
  }, [navigation])

  const setChannelEvents = useCallback(
    (client) => {
      client.on('messageAdded', (message) => {
        setChannels((prevChannels) =>
          prevChannels.map((channel) =>
            channel.id === message.channel.sid ? { ...channel, lastMessageTime: message.dateCreated } : channel,
          ),
        )
      })
      return client
    },
    [setChannels],
  )

  const getSubscribedChannels = useCallback(
    (client) =>
      client.getSubscribedChannels().then((paginator) => {
        channelPaginator.current = paginator
        const newChannels = TwilioService.getInstance().parseChannels(channelPaginator.current.items)
        setChannels(newChannels)
      }),
    [setChannels],
  )

  useEffect(() => {
    const getSession = async () => {
      const session = await getUserSession()
      setIsLoading(true)
      TwilioService.getInstance().getChatClient(session.user.twilio_token)
        .then(() => TwilioService.getInstance().addTokenListener(getToken))
        .then(setChannelEvents)
        .then(getSubscribedChannels)
        .catch((err) => Alert.alert('error', err.message))
        .finally(() => setIsLoading(false))
  
      return () => TwilioService.getInstance().clientShutdown()  
    }

    getSession()

  }, [setChannelEvents, getSubscribedChannels])
  //

  return (
    <ContainerView>
      <SearchBar
        platform="ios"
        placeholder="Search"
        onChangeText={updateSearch}
        value={search}
      />
      <FlatList
        data={channelsToDisplay}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Thread channel={item} onPress={() => {
            navigation.navigate('ChatDetail', { customer: item })
          }}/>
        )}
      />
    </ContainerView>
  )
}

type ThreadProps = {
  channel: Channel
  onPress: () => void
}

const Thread: React.FC<ThreadProps> = ({
  ...props
}) => {
  const getInitials = (word: string): string => {
    const bits = word.trim().split(' ')
    return bits
      .map((bit) => bit.charAt(0))
      .join('')
      .toUpperCase()
  }

  return (
      <ThreadContainerView>
        <TouchableOpacity onPress={props.onPress}>
          <VStack space={5}>
            <HStack space={2}>
              <Avatar>
                {getInitials(props.channel.name)}
                {props.channel.isUnread && <Avatar.Badge bg="green.500" />}
              </Avatar>
              <ThreadFlexFillWidth>
                <HStack alignItems={"center"}>
                  <ThreadTitle>{props.channel.name}</ThreadTitle>
                  <Spacer/>
                  <ThreadTime>{props.channel.time}</ThreadTime>
                </HStack>
                <Spacer/>
                <ThreadLastMessage numberOfLines={1}>{props.channel.lastMessage}</ThreadLastMessage>
              </ThreadFlexFillWidth>
            </HStack>
            <Divider/>
          </VStack>
        </TouchableOpacity>
      </ThreadContainerView>
  )
}

const ThreadFlexFillWidth = styled.View`
  flex: 1;
  width: 100%;
`

const ThreadContainerView = styled.View`
  width: 100%;
  padding-horizontal: 15px;
  padding-top: 15px;
`

const ThreadTitle = styled.Text`
  font-size: 17px;
  font-weight: bold;
  text-align: left;
`

const ThreadTime = styled.Text`
  font-size: 15px;
  color: gray;
  text-align: right;
`

const ThreadLastMessage = styled.Text`
  font-size: 15px;
`

const WarningText = styled.Text`
`

const ContainerView = styled.View`
  background-color: white;
  height: 100%;
  width: 100%;
`

export default InboxScreen
function useApp(): { channels: any; updateChannels: any } {
  throw new Error('Function not implemented.')
}

