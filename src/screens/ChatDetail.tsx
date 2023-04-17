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
  const [isLoading, setIsLoading] = useState(true)
  
  const chatClientConversation = useRef<Conversation>()
  const chatMessagesPaginator = useRef<Paginator<Message>>()

  useEffect(() => {
    TwilioService.getInstance()
      .getChatClient(null)
      .then(setChannelEvents)
      .then((client: Client) => client.getConversationBySid(conversationSid))
      .then((conversation: Conversation) => {
        chatClientConversation.current = conversation
        return conversation.getMessages()
      })
      .then((paginator: Paginator<Message>) => {
        chatMessagesPaginator.current = paginator
        let newMessages = paginator.items.map(item => {
          if (item.attachedMedia.length > 0) {
            const url = item.attachedMedia[0].filename
            console.log(url)
          }
          return {
            _id: item.sid,
            text: item.body,
            createdAt: item.dateCreated,
            user: {
              _id: item.participantSid,
              name: item.author,
              avatar: item.attributes['profile_image_url'],
            },
          } as IMessage
        })
        setMessages(newMessages.reverse())
        setIsLoading(false)
      })
      .catch((err) => { 
        console.log(err)
      })
      navigation.setOptions({ title: "Chat" })
  }, [])

  const setChannelEvents = useCallback(
    async (client) => {
      client.on('messageAdded', (message: Message) => {
        if (message.participantSid != participantSid) { // Don't add our own messages
          setMessages((prevMessages) => [{
            _id: message.sid,
            text: message.body,
            createdAt: message.dateCreated,
            user: {
              _id: message.participantSid,
              name: message.author,
              avatar: message.attributes['profile_image_url'],
            },
          }, ...prevMessages])
        }
      })
      return client
  }, [])

  const onSend = useCallback((newMessages = []) => {
    const attributes = { giftedId: newMessages[0]._id }
    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages))
    chatClientConversation.current?.sendMessage(newMessages[0].text, attributes)
  }, [])

  if (isLoading) {
    return(
      <Container> 
        <PaddedActivityIndicator/>
      </Container>
    )
  }

  return (
    <Container> 
      <GiftedChat
        renderAvatarOnTop
        renderUsernameOnMessage
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: participantSid,
        }}
        />
    </Container>
  )
}

const PaddedActivityIndicator = styled.ActivityIndicator`
  padding: 12px;
`

const Container = styled.View`
  width: 100%;
  height: 100%;
  background-color: white;
`

export default ChatDetail