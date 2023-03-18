import React, { useState } from 'react'
import styled from 'styled-components/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { ChannelList } from 'stream-chat-expo'

import { useChatClient } from '../stream/UseChatClient'
import { RootStackParamList } from '../../App'
import { chatUserId } from '../../chatConfig'
import { useAppContext } from '../stream/AppContext'

type OnboardingSlideGoalsNavigationProp = StackNavigationProp<RootStackParamList, 'InboxScreen'>

type Props = {
  navigation: OnboardingSlideGoalsNavigationProp
}

const filters = {
    members: {
      '$in': [chatUserId]
    },
}

const InboxScreen: React.FC<Props> = ({ navigation }) => {
    const { setChannel } = useAppContext()
    const { clientIsReady } = useChatClient()

    if (!clientIsReady) {
      return <WarningText>Loading chat ...</WarningText>
    } 

    return (
        <ContainerView>
            <ChannelList
                onSelect={(channel) => {
                    setChannel(channel)
                    navigation.navigate('ChatScreen')
                }}
                filters={filters}
            />
        </ContainerView>
    )
}

const WarningText = styled.Text`
`

const ContainerView = styled.View`
  background-color: transparent;
  height: 100%;
  width: 100%;
`

export default InboxScreen
