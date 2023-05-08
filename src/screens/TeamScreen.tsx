import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { ScrollView } from 'react-native-virtualized-view'
import { VStack } from 'native-base'
import { Alert, View } from 'react-native'
import { CommonActions } from '@react-navigation/native'
import * as Clipboard from 'expo-clipboard'

import { RootStackParamList } from '../../App'
import DefaultButton from '../components/DefaultButton'
import { getUserFromToken, removeUserSession } from '../api/Session'
import { DetailSection } from '../components/DetailSection'
import { renderPhoneNumber } from '../utils/RenderPhoneNumber'

type NavigationProp = StackNavigationProp<RootStackParamList, 'TeamScreen'>

type Props = {
  navigation: NavigationProp
}

const TeamScreen: React.FC<Props> = ({ navigation }) => {
  const [servPhone, setServPhone] = useState('')

  useEffect(() => {
    const getUserInfo = async () => {
      let user = await getUserFromToken()
      setServPhone(user.team.twilio_phone_number)
    }

    getUserInfo()
  }, [])

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
      <ScrollView>
        <VStack>
          <ServNumberWrapper>
            <DetailSection title='Serv Number' value={renderPhoneNumber(servPhone)} color={'#0062FF'} onPress={() => {
                Clipboard.setStringAsync(renderPhoneNumber(servPhone))                
                Alert.alert('Copied to clipboard!')
            }}/>
          </ServNumberWrapper>
          <PaddedContainer>
            <ServNumberSubtitle>
              Give this number to customers in order to ensure that they can reach you via Serv.
            </ServNumberSubtitle>
          </PaddedContainer>
        </VStack>     
        <PaddedContainer>
          <DefaultButton label='Log out' onPress={signOut}/>
        </PaddedContainer>        
      </ScrollView>
    </ContainerView>
  )
}

const ServNumberWrapper = styled.View`
  padding-top: 16px;
`

const ServNumberSubtitle = styled.Text`
  font-size: 13px;
  color: gray;
`

const PaddedContainer = styled.View`
  padding: 16px;
`

const ContainerView = styled.View`
  background-color: transparent;
  height: 100%;
  width: 100%;
`

export default TeamScreen
