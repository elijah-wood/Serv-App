import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { Avatar, Divider, HStack, Spacer, VStack } from 'native-base'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Conversation, Message } from '@twilio/conversations'

import { getInitials } from '../utils/GetStringInitials'

type ThreadProps = {
    conversation: Conversation
    userViewingConversationSid: string
    onPress: (name: string) => void
}
  
export const Thread: React.FC<ThreadProps> = ({
    ...props
  }) => {
    const [unreadState, setUnreadState] = useState(false)
    const [name, setName] = useState('Unknown')
    const [lastMessage, setLastMessage] = useState('New Customer')
  
    const getMostRecentMessage = async (): Promise<string> => {
      let messagesPaginator = await props.conversation.getMessages(1)
      const lastMessage = messagesPaginator.items[0];
      let mostRecentMessage = lastMessage?.attachedMedia.length > 0 ?
        'Attachment: Image' :
        lastMessage?.body
      if (mostRecentMessage) {
        setLastMessage(mostRecentMessage)
      }
      return mostRecentMessage
    }

    useEffect(() => {    
        const getName = async () => {
          let participants = await props.conversation.getParticipants()
          participants.forEach((participant) => {
                if (participant.attributes['type'] == 'customer') {
                    let fn = participant.attributes['first_name'] as string
                    let ln = participant.attributes['last_name'] as string
                    
                    if (fn && ln) {
                      setName(fn + ' ' + ln)
                    }
                    return          
                }
            })            
        }

        getName()
        getMostRecentMessage()
    }, [])

    useEffect(() => {
        const getUnreadCount = async () => {
          // Don't update unread state if the user is viewing this conversation
          if (props.conversation && props.conversation.sid != props.userViewingConversationSid) {
              let count = await props.conversation.getUnreadMessagesCount()
              if (count == null) {
                  setUnreadState(true)
              } else if (count > 0) {
                  setUnreadState(true)
              }
          }
        }
        getUnreadCount()
        getMostRecentMessage()
    }, [props.conversation.lastMessage?.dateCreated])
  
    function formatDate(date: Date): string {
      const now = new Date()
    
      // Check if the date is today
      if (date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
        return date.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric', hour12: true })
      }
    
      // Check if the date is yesterday
      now.setDate(now.getDate() - 1)
      if (date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
        return 'Yesterday'
      }
    
      // Check if the date is within a week but not yesterday
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 6)
      if (date >= weekAgo && date < now) {
        const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        const dayOfWeek = weekday[date.getDay()]
        return dayOfWeek
      }
    
      // If the date is not today, yesterday, or within a week, display the date in mm/dd/yyyy format
      return date.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' })
    }    
  
    return (
        <>
            {(unreadState == true) && <>
                <UnreadContainer>
                    <UnreadCircle/>
                </UnreadContainer>
            </>}
            <ThreadContainerView>
                <TouchableOpacity onPress={() => { 
                    // Mark as read immediately
                    setUnreadState(false)
                    props.onPress(name)
                }}>
                <VStack space={5}>
                    <HStack space={2}>
                      <Avatar source={name === 'Serv Team' && require('../assets/icon.png')}>
                          {getInitials(name)}
                      </Avatar>
                    <ThreadFlexFillWidth>
                        <HStack alignItems={"center"}>
                        <ThreadTitle>{name}</ThreadTitle>
                        <Spacer/>
                        <ThreadTime>{formatDate(props.conversation.lastMessage?.dateCreated ?? props.conversation.dateCreated)}</ThreadTime>
                        </HStack>
                        <Spacer/>
                        <ThreadLastMessage numberOfLines={1}>{lastMessage}</ThreadLastMessage>
                    </ThreadFlexFillWidth>
                    </HStack>
                    <Divider/>
                </VStack>
                </TouchableOpacity>
            </ThreadContainerView>
        </>
    )
  }

const UnreadContainer = styled.View`
  position: absolute;
  justify-content: center;
  align-items: center;
  padding-left: 5px;
  padding-bottom: 4px;
  height: 100%;
  z-index: 1;
`

const UnreadCircle = styled.View`
  width: 9px;
  height: 9px;
  border-radius: 4.5px;
  background-color: #007AFF;
`

const ThreadFlexFillWidth = styled.View`
  flex: 1;
  width: 100%;
`

const ThreadContainerView = styled.View`
  width: 100%;
  padding-left: 20px;
  padding-right: 16px;
  padding-top: 16px;
`

const ThreadTitle = styled.Text`
  font-size: 17px;
  font-weight: bold;
  text-align: left;
`

const ThreadTime = styled.Text`
  font-size: 15px;
  color: gray;
  text-align: right;
`

const ThreadLastMessage = styled.Text`
  font-size: 15px;
`