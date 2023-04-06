import { StackNavigationProp } from '@react-navigation/stack'
import { GiftedChat } from 'react-native-gifted-chat'
import { useCallback, useEffect, useState } from "react"
import styled from 'styled-components/native'
import { RouteProp } from '@react-navigation/native'

import { RootStackParamList } from '../../App'

type NavigationProp = StackNavigationProp<RootStackParamList, 'ChatScreen'>
type ChatDetailRouteProp = RouteProp<RootStackParamList, 'ChatScreen'>

type Props = {
  navigation: NavigationProp
  route: ChatDetailRouteProp
}

const ChatDetail: React.FC<Props> = ({ navigation, route }) => {
  const { customer } = route.params
  const [messages, setMessages] = useState([])

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: customer.lastMessage,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: customer.name,
          avatar: '',
        },
      },
    ])

    navigation.setOptions({ title: customer.name })
  }, [])

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  }, [])

  return (
    <Container>
      <GiftedChat
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