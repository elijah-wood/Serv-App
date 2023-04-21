import { StackNavigationProp } from '@react-navigation/stack'
import { Chat, MessageType, defaultTheme } from '@flyerhq/react-native-chat-ui'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
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
  const { conversationSid, name } = route.params
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
        conversation.updateLastReadMessageIndex(conversation.lastMessage.index)
        chatClientConversation.current = conversation
        return conversation.getMessages()
      })
      .then((paginator: Paginator<Message>) => {
        chatMessagesPaginator.current = paginator
        addNewMessages(false)
        setIsLoading(false)
      })
      .catch((err) => { 
        console.log(err)
      })
      navigation.setOptions({ title: name })
  }, [])

  const addNewMessages = (includePreviousMessages: boolean) => {
    let newMessages = chatMessagesPaginator.current.items.map(item => {
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
    if (includePreviousMessages) {
      setMessages([...messages, ...newMessages.reverse()])
    } else {
      setMessages(newMessages.reverse())
    }
  }

  const setChannelEvents = useCallback(
    async (client) => {
      client.on('messageAdded', (message: Message) => {
        // Update read index
        chatClientConversation.current.updateLastReadMessageIndex(chatClientConversation.current.lastMessage.index)
        // Don't add our own messages
        if (message.participantSid != participantSid) { 
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
          colors: { ...defaultTheme.colors, inputBackground: '#0062FF', primary: '#0062FF', userAvatarNameColors: ['#363636'] },
        }}
        user={{
          id: participantSid,
        }}
        onEndReached={async () => {
          if (chatMessagesPaginator.current.hasPrevPage) {
            chatMessagesPaginator.current = await chatMessagesPaginator.current.prevPage()
            addNewMessages(true)
          }
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