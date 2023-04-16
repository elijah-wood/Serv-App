import { StackNavigationProp } from '@react-navigation/stack'
import { GiftedChat, IMessage } from 'react-native-gifted-chat'
import { useCallback, useEffect, useRef, useState } from "react"
import styled from 'styled-components/native'
import { RouteProp } from '@react-navigation/native'
import { Client, Conversation, Message, Paginator } from '@twilio/conversations'

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
  const [messages, setMessages] = useState<IMessage[]>([])
  const [participantSid, setParticipantSid] = useState<string>('MB298bd975cbed4e59a1beec3430859b17')
  
  const chatClientConversation = useRef<Conversation>()
  const chatMessagesPaginator = useRef<Paginator<Message>>()

  const setChannelEvents = useCallback((client) => {
    client.on('messageAdded', (message: Message) => {
      if (message.participantSid != participantSid) {
        setMessages((prevMessages) => [{
          _id: message.sid,
          text: message.body,
          createdAt: message.dateCreated,
          user: {
            _id: message.participantSid,
            name: message.attributes['name'],
            avatar: message.attributes['profile_image_url'],
          },
        }, ...prevMessages])
      }
    })
    return client
  }, [])

  const getMessages = useCallback(
    async (conversation: Conversation) => {
      chatClientConversation.current = conversation
      const twilioMessages = await conversation.getMessages()
      setMessages(twilioMessages.items.reverse().map(item => {
        return {
          _id: item.sid,
          text: item.body,
          createdAt: item.dateCreated,
          user: {
            _id: item.participantSid,
            name: item.attributes['name'],
            avatar: item.attributes['profile_image_url'],
          },
        }
      }))
    },
    [setMessages],
  )

  useEffect(() => {
    TwilioService.getInstance()
      .getChatClient(null)
      .then(setChannelEvents)
      .then((client) => client.getConversationBySid(conversationSid))
      .then(getMessages)
      .catch((err) => { 
        console.log(err)
      })
  }, [setChannelEvents])

  const onSend = useCallback((newMessages = []) => {
    const attributes = { giftedId: newMessages[0]._id }
    setMessages((prevMessages) => [newMessages[0], ...prevMessages])
    chatClientConversation.current?.sendMessage(newMessages[0].text, attributes)
  }, [setMessages])

  useEffect(() => {
    navigation.setOptions({ title: "Chat" })
  }, [])

  return (
    <Container> 
      <GiftedChat
        renderAvatarOnTop
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: participantSid,
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