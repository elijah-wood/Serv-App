import { StackNavigationProp } from '@react-navigation/stack'
import { GiftedChat } from 'react-native-gifted-chat'
import { useCallback, useEffect, useRef, useState } from "react"
import styled from 'styled-components/native'
import { RouteProp } from '@react-navigation/native'
import { Client, Message } from '@twilio/conversations'

import { RootStackParamList } from '../../App'
import { TwilioService } from '../twilio/TwilioService'

type NavigationProp = StackNavigationProp<RootStackParamList, 'ChatDetail'>
type ChatDetailRouteProp = RouteProp<RootStackParamList, 'ChatDetail'>

type Props = {
  navigation: NavigationProp
  route: ChatDetailRouteProp
}

const ChatDetail: React.FC<Props> = ({ navigation, route }) => {
  const { conversationSid } = route.params
  const [messages, setMessages] = useState<Message[]>([])

  const chatMessagesPaginator = useRef()

  const setChannelEvents = useCallback(
    (client) => {
      client.on('messageAdded', (message: Message) => {
          setMessages((prevMessages) => [message, ...prevMessages])
      })
      return client
    },
    [],
  )

  const getMessages = useCallback(
    async (client: Client) => {
      client.on('stateChanged', async (state) => {
        if (state === 'initialized') {
          const conversation = await client.getConversationBySid(conversationSid)
          const messages = await conversation.getMessages()
          setMessages(messages.items)
          console.log(messages.items)
        } 
      })
    },
    [setMessages],
  )

  useEffect(() => {
    TwilioService.getInstance()
      .getChatClient(null)
      .then((client) => client.getConversationBySid(conversationSid))
      .then(setChannelEvents)
      .then(getMessages)
      .catch((err) => { 
        console.log(err)
      })
  }, [setChannelEvents])

  const onSend = useCallback((newMessages = []) => {
    TwilioService.getInstance()
      .getChatClient(null)
      .then((client) => client.getConversationBySid(conversationSid))
      .then((channel) => {
        const attributes = { giftedId: newMessages[0]._id }
        setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages))
        channel.sendMessage(newMessages[0].text, attributes)
      })
  }, [])

  useEffect(() => {
    navigation.setOptions({ title: "TBD" })
  }, [])

  return (
    <Container> 
      <GiftedChat
        renderAvatarOnTop
        messages={[]}
        onSend={messages => onSend(messages)}
        user={{
          _id: conversationSid,
        }}
        />
    </Container>
  
  )
}

const Container = styled.View`
  width: 100%;
  height: 100%;
  background-color: white;
`

export default ChatDetail