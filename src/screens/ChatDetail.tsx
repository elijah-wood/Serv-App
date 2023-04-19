import { StackNavigationProp } from '@react-navigation/stack'
// import { GiftedChat, IMessage } from 'react-native-gifted-chat'
import { Chat, MessageType, defaultTheme } from '@flyerhq/react-native-chat-ui'
import { useCallback, useEffect, useRef, useState } from "react"
import styled from 'styled-components/native'
import { RouteProp } from '@react-navigation/native'
import { Client, Conversation, Message, Paginator } from '@twilio/conversations'
import { SafeAreaProvider } from 'react-native-safe-area-context'

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
  const [messages, setMessages] = useState<MessageType.Any[]>([])
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
            id: item.sid,
            text: item.body,
            createdAt: item.dateCreated.getTime(),
            author: {
              id: item.participantSid,
              firstName: item.author,
            },
            type: 'text'
          } as MessageType.Any
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
            id: message.sid,
            text: message.body,
            createdAt: message.dateCreated.getTime(),
            author: {
              id: message.participantSid,
              firstName: message.author,
            },
            type: 'text'
          }  as MessageType.Any, ...prevMessages])
        }
      })
      return client
  }, [])

  const onSend = (message: MessageType.PartialText) => {
    const uuidv4 = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.floor(Math.random() * 16)
        const v = c === 'x' ? r : (r % 4) + 8
        return v.toString(16)
      })
    }

    const addMessage = (message: MessageType.Any) => {
      setMessages([message, ...messages])
    }

    const textMessage: MessageType.Text = {
      author: { id: participantSid },
      createdAt: Date.now(),
      id: uuidv4(),
      text: message.text,
      type: 'text',
    }

    addMessage(textMessage)
    chatClientConversation.current?.sendMessage(textMessage.text, textMessage.metadata)
  }

  if (isLoading) {
    return(
      <Container> 
        <PaddedActivityIndicator/>
      </Container>
    )
  }

  return (
    <Container> 
      <Chat
        showUserAvatars
        showUserNames
        messages={messages}
        onSendPress={messages => onSend(messages)}
        theme={{
          ...defaultTheme,
          colors: { ...defaultTheme.colors, inputBackground: 'blue' },
        }}
        user={{
          id: participantSid,
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