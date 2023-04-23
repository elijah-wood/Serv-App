import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import styled from 'styled-components/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { FlatList } from 'react-native'
import { Icon, IconButton } from 'native-base'

import { RootStackParamList } from '../../App'
import { TwilioService } from '../twilio/TwilioService'
import { API } from '../api/API'
import { Client, Conversation, Paginator, Message } from '@twilio/conversations'
import { Thread } from '../components/ConversationThread'

type OnboardingSlideGoalsNavigationProp = StackNavigationProp<RootStackParamList, 'InboxScreen'>

type Props = {
  navigation: OnboardingSlideGoalsNavigationProp
}

const InboxScreen: React.FC<Props> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])

  const conversationPaginator = useRef<Paginator<Conversation>>()

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
    navigation.setOptions({headerShown: true})
    return () => {
      TwilioService.serviceInstance.clientShutdown()
    }
  }, [])
  
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
        setConversations((prevConversations) =>
          prevConversations.map((conversation) => {
            if (conversation.sid === message.conversation.sid && conversation.lastMessage != undefined) {
              let updatedConvo = conversation
              updatedConvo.lastMessage.dateCreated = message.dateCreated
              return updatedConvo
            } else {
              return conversation
            }
          })
        )
      })
      client.on('conversationAdded', (conversation: Conversation) => {
        setConversations([conversation, ...conversations])
      })
      return client
    },
    [],
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
    [],
  )

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
        data={conversations.sort((a, b) => { 
          let dateA: Date
          if (a.lastMessage) {
            dateA = a.lastMessage.dateCreated
          } else {
            dateA = a.dateCreated
          }
          let dateB: Date
          if (b.lastMessage) {
            dateB = b.lastMessage.dateCreated
          } else {
            dateB = b.dateCreated
          }
          return +new Date(dateB) - +new Date(dateA)
        })}
        keyExtractor={(item) => item.sid}
        renderItem={({ item }) => (
          <Thread conversation={item} onPress={(name: string) => {
            navigation.navigate('ChatDetail', { conversationSid: item.sid, name: name})
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
  background-color: white;
  height: 100%;
  width: 100%;
`

export default InboxScreen

