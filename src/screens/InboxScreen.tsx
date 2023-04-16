import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import styled from 'styled-components/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { SearchBar } from '@rneui/themed'
import { FlatList } from 'react-native'
import { Avatar, Divider, HStack, Icon, IconButton, Spacer, VStack } from 'native-base'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { RootStackParamList } from '../../App'
import { TwilioService } from '../twilio/TwilioService'
import { API } from '../api/API'
import { Client, Conversation, Paginator, Message } from '@twilio/conversations'

type OnboardingSlideGoalsNavigationProp = StackNavigationProp<RootStackParamList, 'InboxScreen'>

type Props = {
  navigation: OnboardingSlideGoalsNavigationProp
}

const InboxScreen: React.FC<Props> = ({ navigation }) => {
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  // const [channelsToDisplay, setChannelsToDisplay] = useState<Conversation[]>([])

  const conversationPaginator = useRef<Paginator<Conversation>>()

  // React.useEffect(() => {
  //   let filteredArray: Channel[] = []
  //   channels.forEach(element => filteredArray.push(element))
  //   setChannelsToDisplay(filteredArray)
  // }, [channels])

  // const updateSearch = (search) => {
  //   let filteredArray: Channel[] = []
  //   channels.filter(channel => channel.name.toUpperCase().includes(search.toUpperCase())).forEach(element => filteredArray.push(element))
  //   setChannelsToDisplay(filteredArray)
  //   setSearch(search)
  // }

  // TWILIO
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
      client.on('messageAdded', (message: Message) => {
        console.log("message addded inbox: " + message.body)
        // setConversations((prevConversations) =>
        //   prevConversations.map((channel) =>
        //     channel.sidd === message.conversation.sid ? { ...channel, lastMessageTime: message.dateCreated } : channel,
        //   ),
        // )
      })
      client.on('conversationAdded', (conversation: Conversation) => {
        console.log("conversation addded: " + conversation._participants)
        let updatedConversations = conversations
        updatedConversations.push(conversation)
        setConversations(updatedConversations)
      })
      return client
    },
    [setConversations],
  )

  const getSubscribedConversations = useCallback(
    async (client: Client) => {
      client.on('stateChanged', async (state) => {
        if (state === 'initialized') {
          const conversations = await client.getSubscribedConversations()
          conversationPaginator.current = conversations
          setConversations(conversations.items)
          setIsLoading(false)
        } 
      })
    },
    [setConversations],
  )

  useEffect(() => {
    setIsLoading(true)
    API.createTwilioAccessToken()
      .then((response) => TwilioService.getInstance().getChatClient(response.result))
      .then(() => TwilioService.getInstance().addTokenListener(API.createTwilioAccessToken()))
      .then(setChannelEvents)
      .then(getSubscribedConversations)
      .catch((err) => {
        // do something
        console.log(err)
        setIsLoading(false)
      })
  
  }, [setChannelEvents, getSubscribedConversations])

  if (isLoading) {
    return(
      <PaddedActivityIndicator/>
    )
  }

  return (
    <ContainerView>
      {/* <SearchBar
        platform="ios"
        placeholder="Search"
        onChangeText={updateSearch}
        value={search}
      /> */}
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.sid}
        renderItem={({ item }) => (
          <Thread conversation={item} onPress={() => {
            navigation.navigate('ChatDetail', { conversationSid: item.sid })
          }}/>
        )}
      />
    </ContainerView>
  )
}

type ThreadProps = {
  conversation: Conversation
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

  useEffect(() => {
    console.log(props.conversation.attributes)
  }, [])

  return (
      <ThreadContainerView>
        <TouchableOpacity onPress={props.onPress}>
          <VStack space={5}>
            <HStack space={2}>
              <Avatar>
                {/* {getInitials(props.conversation.attributes['name'])}
                {props.channel.isUnread && <Avatar.Badge bg="green.500" />} */}
              </Avatar>
              <ThreadFlexFillWidth>
                <HStack alignItems={"center"}>
                  {/* <ThreadTitle>{props.conversation.dateUpdated}</ThreadTitle>
                  <Spacer/>
                  <ThreadTime>{props.conversation.dateUpdated}</ThreadTime> */}
                </HStack>
                <Spacer/>
                <ThreadLastMessage numberOfLines={1}>{props.conversation.lastMessage.index}</ThreadLastMessage>
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

const PaddedActivityIndicator = styled.ActivityIndicator`
  padding: 12px;
`

const ContainerView = styled.View`
  background-color: white;
  height: 100%;
  width: 100%;
`

export default InboxScreen

