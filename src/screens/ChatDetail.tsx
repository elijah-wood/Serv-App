import { StackNavigationProp } from '@react-navigation/stack'
import { Chat, MessageType, defaultTheme, User } from '@flyerhq/react-native-chat-ui'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import styled from 'styled-components/native'
import { RouteProp } from '@react-navigation/native'
import { Client, Conversation, Message, Paginator, Participant } from '@twilio/conversations'

import { RootStackParamList } from '../../App'
import { TwilioService } from '../twilio/TwilioService'
import { getUserFromToken } from '../api/Session'
import { UserResponse } from '../api/UserResponse'
import { Image } from 'react-native'

type NavigationProp = StackNavigationProp<RootStackParamList, 'ChatDetail'>
type ChatDetailRouteProp = RouteProp<RootStackParamList, 'ChatDetail'>

type Props = {
  navigation: NavigationProp
  route: ChatDetailRouteProp
}

function renderImageMessage(message: MessageType.Image) {
  const height = message.height ?? 200;
  const width = message.width ?? 200;

  return <Image
      accessibilityRole='image'
      resizeMode="cover"
      source={{ uri: message.uri }}
      style={{ width, height }}
    />;
}

const ChatDetail: React.FC<Props> = ({ navigation, route }) => {
  const { conversationSid, name } = route.params
  const [messages, setMessages] = useState<MessageType.Any[]>([])
  const [participantId, setParticipantID] = useState<string>()
  const [participants, setParticipants] = useState<Participant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const chatClientConversation = useRef<Conversation>()
  const chatMessagesPaginator = useRef<Paginator<Message>>()

  useEffect(() => {
    navigation.setOptions({ title: name })

    const fetchMessages = async () => {
      let client = await TwilioService.getInstance().getChatClient(null)
    
      let conversation = await client.getConversationBySid(conversationSid)
      conversation.setAllMessagesRead()
 
      chatClientConversation.current = conversation
      // Get our participant id
      let user = await getUserFromToken()
      let participants = await conversation.getParticipants()
      let participantSid: string = null
      participants.forEach(participant => {
        console.log(`type: ${ participant.attributes['type']}`)
        if (participant.attributes['type'] == 'user') {
          console.log('is us')
          // Find out which user is us
          let id = participant.attributes['user_id']
          if (id == user.id) {
            participantSid = participant.sid
          }
        }
      })
      console.log(`our id: ${participantSid}`)
      setChannelEvents(client, participants)
      setParticipantID(participantSid)
      setParticipants(participants)

      let messages = await conversation.getMessages()
      chatMessagesPaginator.current = messages
      await addNewMessages(participants, false)

      setIsLoading(false)
    }

    fetchMessages()
  }, [])

  const addNewMessages = async (participants: Participant[], includePreviousMessages: boolean) => {
    let newMessages = await Promise.all(chatMessagesPaginator.current.items.map(async item => {      
      let participant = participants.find(participant => participant.sid === item.participantSid )
      console.log(`participant id: ${item.participantSid}`)
      const message = {
        id: item.sid,
        createdAt: item.dateCreated.getTime(),
        author: {
          id: item.participantSid ?? 'autoReply',
          firstName: participant?.attributes['first_name'] ?? 'Auto',
          lastName: participant?.attributes['last_name'] ?? 'Reply',
        } as User,
      };

      if (message.author.firstName === 'Serv' && message.author.lastName === 'Team') {
        message.author.imageUrl = Image.resolveAssetSource(require('../assets/icon.png')).uri
      }
      
      if (item.attachedMedia.length > 0) {
        const mediaUrls = await item.getTemporaryContentUrlsForAttachedMedia();
        const uri = mediaUrls.get(item.attachedMedia[0].sid);
        return {
          ...message,
          uri,
          type: 'image'
        } as MessageType.Image
      }
      
      return {
        ...message,
        text: item.body,
        type: 'text'
      } as MessageType.Text
    }));
    if (includePreviousMessages) {
      setMessages([...messages, ...newMessages.reverse()])
    } else {
      setMessages(newMessages.reverse())
    }
  }

  const setChannelEvents = useCallback(
    async (client, participants) => {
      client.on('messageAdded', (message: Message) => {
        // Update read index
        chatClientConversation.current.setAllMessagesRead()
        let participant = participants.find(participant => participant.sid === message.participantSid )
        setMessages((prevMessages) => [{
          id: message.sid,
          text: message.body,
          createdAt: message.dateCreated.getTime(),
          author: {
            id: message.participantSid ?? 'autoReply',
            firstName: participant?.attributes['first_name'] ?? "Auto",
            lastName: participant?.attributes['last_name'] ?? "Reply",
          },
          type: 'text'
        }  as MessageType.Any, ...prevMessages])
      })
      return client
  }, [])

  const onSend = (message: MessageType.PartialText) => {
    chatClientConversation.current?.sendMessage(message.text, message.metadata)
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
        textInputProps={{ placeholder: 'Type message here' }}
        messages={messages}
        onSendPress={message => onSend(message)}
        renderImageMessage={renderImageMessage}
        theme={{
          ...defaultTheme,
          colors: { ...defaultTheme.colors, inputBackground: '#0062FF', primary: '#0062FF', userAvatarNameColors: ['#363636'] },
        }}
        user={{
          id: participantId,
        }}
        onEndReached={async () => {
          if (chatMessagesPaginator.current.hasPrevPage) {
            chatMessagesPaginator.current = await chatMessagesPaginator.current.prevPage()
            addNewMessages(participants, true)
          }
        }}
        emptyState={() => (
            <EmptyChatMessageText>
              {`This is the start of your message history with ${name}. If you need any assistance, please reach out to @serv and a team member will reply as soon as possible.`}
            </EmptyChatMessageText>  
          )}
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

const EmptyChatMessageText = styled.Text`
  font-size: 15px;
  line-height: 18px;
  opacity: 0.3;
  letter-spacing: -0.24px;
`;

export default ChatDetail