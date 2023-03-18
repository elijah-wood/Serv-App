import { Channel, MessageList, MessageInput } from "stream-chat-expo"
import { StackNavigationProp } from '@react-navigation/stack'

import { useAppContext } from "../stream/AppContext"
import { RootStackParamList } from '../../App'

type NavigationProp = StackNavigationProp<RootStackParamList, 'ChatScreen'>

type Props = {
  navigation: NavigationProp
}

const ChatScreen: React.FC<Props> = ({ navigation }) => {
    const { channel } = useAppContext()
  
    return (
      <Channel channel={channel}>
        <MessageList />
        <MessageInput />
      </Channel>
    )
}

export default ChatScreen