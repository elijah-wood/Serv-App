import React, { useState } from 'react'
import styled from 'styled-components/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { SearchBar } from '@rneui/themed'
import { StreamChat } from 'stream-chat'
import {
  Channel,
  Chat,
  MessageInput,
  MessageList,
  OverlayProvider as ChatOverlayProvider,
} from 'stream-chat-expo'

import { RootStackParamList } from '../../App'

type OnboardingSlideGoalsNavigationProp = StackNavigationProp<RootStackParamList, 'InboxScreen'>

type Props = {
  navigation: OnboardingSlideGoalsNavigationProp
}

const InboxScreen: React.FC<Props> = ({ navigation }) => {
    const [search, setSearch] = useState("")

    const updateSearch = (search) => {
        
        setSearch(search)
    }

    return (
        <ContainerView>
            <SearchBar
                platform="ios"
                placeholder="Search"
                onChangeText={updateSearch}
                value={search}
            />
        {/* <FlatList
            data={[
                {key: 'Devin'},
                {key: 'Dan'},
                {key: 'Dominic'},
                {key: 'Jackson'},
                {key: 'James'},
                {key: 'Joel'},
                {key: 'John'},
                {key: 'Jillian'},
                {key: 'Jimmy'},
                {key: 'Julie'},
            ]}
            renderItem={({item}) => {
                <Text style={styles.item}>{item.key}</Text>
            }
        }
        /> */}
        </ContainerView>
    )
}

const ContainerView = styled.View`
  background-color: transparent;
  height: 100%;
  width: 100%;
`

export default InboxScreen
