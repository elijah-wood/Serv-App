import React from 'react'
import styled from 'styled-components/native'
import { StackNavigationProp } from '@react-navigation/stack'

import { RootStackParamList } from '../../App'
import DefaultButton from '../components/DefaultButton'
import { removeUserSession } from '../api/Session'
import { CommonActions } from '@react-navigation/native'

type NavigationProp = StackNavigationProp<RootStackParamList, 'TeamScreen'>

type Props = {
  navigation: NavigationProp
}

const TeamScreen: React.FC<Props> = ({ navigation }) => {

    const signOut = async () => { 
        await removeUserSession()
        navigation.dispatch(
            // Reset stack for Android
            CommonActions.reset({
                index: 1,
                routes: [{ name: 'Account' }],
            })
          )
    }
    
  return (
    <ContainerView>
      <ScrollViewWrapper>
        <ScrollView>
            <DefaultButton label='Log out' onPress={signOut}/>
        </ScrollView>
      </ScrollViewWrapper>
    </ContainerView>
  )
}

const ContainerView = styled.View`
  background-color: transparent;
  height: 100%;
  width: 100%;
`

const ScrollViewWrapper = styled.SafeAreaView``

const ScrollView = styled.ScrollView`
    padding: 10px;
`

export default TeamScreen
