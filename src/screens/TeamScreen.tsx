import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { ScrollView } from 'react-native-virtualized-view'
import { Avatar, Center, VStack } from 'native-base'
import { Alert } from 'react-native'
import { CommonActions } from '@react-navigation/native'
import * as Clipboard from 'expo-clipboard'

import { RootStackParamList } from '../../App'
import DefaultButton from '../components/DefaultButton'
import { getUserFromToken, removeUserSession } from '../api/Session'
import { DetailSection } from '../components/DetailSection'
import { renderPhoneNumber } from '../utils/RenderPhoneNumber'
import { getInitials } from '../utils/GetStringInitials'
import { renderCustomerFullName } from '../utils/RenderCustomerFullName'
import { UserResponse } from '../api/UserResponse'

type NavigationProp = StackNavigationProp<RootStackParamList, 'TeamScreen'>

type Props = {
  navigation: NavigationProp
}

const TeamScreen: React.FC<Props> = ({ navigation }) => {
  const [servPhone, setServPhone] = useState('')
  const [user, setUser] = useState<UserResponse>()

  useEffect(() => {
    const getUserInfo = async () => {
      let user = await getUserFromToken()
      setUser(user)      
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
          <Center>
            <AvatarContainer>
              <Avatar size={'xl'}>{getInitials(user?.team.name ?? '')}</Avatar>
            </AvatarContainer>
            <TeamName>{user?.team.name ?? ''}</TeamName>
          </Center>
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

const AvatarContainer = styled.View`
  padding: 16px;
`

const TeamName = styled.Text`
  font-weight: bold;
  font-size: 28px;
`

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
