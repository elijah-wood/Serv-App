import { StackNavigationProp } from '@react-navigation/stack'
import { GiftedChat } from 'react-native-gifted-chat'
import { useCallback, useEffect, useRef, useState } from "react"
import styled from 'styled-components/native'
import { RouteProp } from '@react-navigation/native'

import { RootStackParamList } from '../../App'
import { TwilioService } from '../twilio/TwilioService'

type NavigationProp = StackNavigationProp<RootStackParamList, 'ChatDetail'>
type ChatDetailRouteProp = RouteProp<RootStackParamList, 'ChatDetail'>

type Props = {
  navigation: NavigationProp
  route: ChatDetailRouteProp
}

const ChatDetail: React.FC<Props> = ({ navigation, route }) => {
  const { customer } = route.params
  const [messages, setMessages] = useState([])

  const chatClientChannel = useRef()
  const chatMessagesPaginator = useRef()

  const setChannelEvents = useCallback((channel) => {
    chatClientChannel.current = channel
    chatClientChannel.current.on('messageAdded', (message) => {
      const newMessage = TwilioService.getInstance().parseMessage(message)
      const { giftedId } = message.attributes
      if (giftedId) {
        setMessages((prevMessages) => prevMessages.map((m) => (m._id === giftedId ? newMessage : m)))
      } else {
        setMessages((prevMessages) => [newMessage, ...prevMessages])
      }
    })
    return chatClientChannel.current
  }, [])

  useEffect(() => {
    TwilioService.getInstance()
      .getChatClient()
      .then((client) => client.getChannelBySid(channelId))
      .then((channel) => setChannelEvents(channel))
      .then((currentChannel) => currentChannel.getMessages())
      .then((paginator) => {
        chatMessagesPaginator.current = paginator
        const newMessages = TwilioService.getInstance().parseMessages(paginator.items)
        setMessages(newMessages)
      })
      .catch((err) => showMessage({ message: err.message, type: 'danger' }))
  }, [channelId, setChannelEvents])

  const onSend = useCallback((newMessages = []) => {
    const attributes = { giftedId: newMessages[0]._id }
    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages))
    chatClientChannel.current?.sendMessage(newMessages[0].text, attributes)
  }, [])

  useEffect(() => {
    navigation.setOptions({ title: customer.name })
  }, [])

  return (
    <Container>
      <GiftedChat
        renderAvatarOnTop
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
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