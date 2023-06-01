import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import styled from 'styled-components/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Alert, FlatList, Platform } from 'react-native'
import { Icon, IconButton } from 'native-base'
import { useFocusEffect } from '@react-navigation/native'
import { Client, Conversation, Paginator, Message } from '@twilio/conversations'
import * as Notifications from 'expo-notifications'

import { RootStackParamList } from '../../App'
import { TwilioService } from '../twilio/TwilioService'
import { API } from '../api/API'
import { Thread } from '../components/ConversationThread'
import { registerForPushNotificationsAsync } from '../utils/PushNotifications'
import { EmptyStateView } from '../components/EmptyStateView'

type OnboardingSlideGoalsNavigationProp = StackNavigationProp<RootStackParamList, 'InboxScreen'>

type Props = {
  navigation: OnboardingSlideGoalsNavigationProp
}

const InboxScreen: React.FC<Props> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [userViewingConversationSid, setUserViewingConversationSid] = useState<string>()
  const conversationPaginator = useRef<Paginator<Conversation>>()
  const notificationListener = useRef<Notifications.Subscription>()

  useEffect(() => {
    navigation.setOptions({ headerShown: true })

    setIsLoading(true)
    API.createTwilioAccessToken()
      .then((response) => TwilioService.getInstance().getChatClient(response.result))
      .then(() => TwilioService.getInstance().addTokenListener())
      .then(configurePushNotifications)
      .then(setChannelEvents)
      .then(getSubscribedConversations)
      .catch((err) => {
        // do something
        console.log(err)
        setIsLoading(false)
      })
    return () => {
      TwilioService.getInstance()?.clientShutdown()
      Notifications.removeNotificationSubscription(notificationListener.current)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      // Reset focused conversation
      setUserViewingConversationSid(null)
    }, [])
  )
  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton icon={<Icon name='plus' color={'#0062FF'} size={25}/>} onPress={() => {
          navigation.navigate('AddCustomerScreen')
        }}/>
      ),
    })
  }, [navigation])

  const configurePushNotifications = useCallback(
    (client: Client) => {            
      registerForPushNotificationsAsync().then(token => {
        if (token) {
          if (Platform.OS === 'android') {            
            client.setPushRegistrationId('fcm', token)
          } else if (Platform.OS === 'ios') {
            client.setPushRegistrationId('apn', token)
          }                    
        }     
      })
      if (notificationListener.current == undefined) {      
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
          client.handlePushNotification(notification)
        })
      }
      return client
    }, [],
  )

  const setChannelEvents = useCallback(
    (client: Client) => {            
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
        setConversations((prevConversations) => {
          // Check if conversation already exists in the array
          if (prevConversations.some((conv) => conv.sid === conversation.sid)) {
            return prevConversations
          }
          return [conversation, ...prevConversations]
        })               
      })
      return client
    },
    [],
  )

  const getSubscribedConversations = useCallback(
    async (client: Client) => {
      client.on('stateChanged', async (state) => {
        if (state === 'initialized') {
          const subscribedConversations = await client.getSubscribedConversations()
          conversationPaginator.current = subscribedConversations
          // Conversations set during conversationAdded event
          setIsLoading(false)
        } 
        if (state == 'failed') {
          Alert.alert("Error initializing Twilio.")
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
          <Thread conversation={item} userViewingConversationSid={userViewingConversationSid} onPress={(name: string) => {
            setUserViewingConversationSid(item.sid)
            navigation.navigate('ChatDetail', { conversationSid: item.sid, name: name})
          }}/>
        )}
        contentContainerStyle={{flex: 1}}
        ListEmptyComponent={
          <EmptyStateView
            title='Send your first message'
            subtitle='Go to the Customers tab to add your first customer. Once done, you will be able to message them here.'
          />
        }
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

