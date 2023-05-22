import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { ScrollView } from 'react-native-virtualized-view'
import { Avatar, Center, ChevronRightIcon, Divider, HStack, Spacer, VStack } from 'native-base'
import { Alert, Button, DeviceEventEmitter, FlatList, RefreshControl, TouchableOpacity } from 'react-native'
import { CommonActions } from '@react-navigation/native'
import * as Clipboard from 'expo-clipboard'

import { RootStackParamList } from '../../App'
import DefaultButton from '../components/DefaultButton'
import { getUserFromToken, removeUserSession } from '../api/Session'
import { DetailSection, SectionContainer, SectionTitle } from '../components/DetailSection'
import { renderPhoneNumber } from '../utils/RenderPhoneNumber'
import { getInitials } from '../utils/GetStringInitials'
import { UserResponse } from '../api/UserResponse'
import { Member } from '../api/UseCustomers'
import UseMembers from '../api/UseMembers'

type NavigationProp = StackNavigationProp<RootStackParamList, 'TeamScreen'>

type Props = {
  navigation: NavigationProp
}

const TeamScreen: React.FC<Props> = ({ navigation }) => {
  const useMembers = UseMembers()

  const [servPhone, setServPhone] = useState('')
  const [user, setUser] = useState<UserResponse>()
  const [members, setMembers] = useState<Member[]>([])

  useEffect(() => {
    DeviceEventEmitter.addListener("event.refetchTeamMembers", () => useMembers.refetch())
    return () => {
      DeviceEventEmitter.removeAllListeners("event.refetchTeamMembers")
    }
  }, [])

  useEffect(() => {
    const getUserInfo = async () => {
      let user = await getUserFromToken()
      setUser(user)      
      setServPhone(user.team.twilio_phone_number)
    }

    getUserInfo()
  }, [])

  useEffect(() => {
    const renderMembers = async (members: Member[]) => {
      let user = await getUserFromToken()
      setMembers([{ id: '1', User: user, isYou: true}, ...members])
    }

    switch (useMembers.status) {
      case 'success':
        if (useMembers.data.result) {
          renderMembers(useMembers.data.result)
        }
        break
      default:
        break
    }
  }, [useMembers.data])

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

  if (useMembers.isLoading) {
    return (
      <ContainerView>
          <PaddedActivityIndicator/>
      </ContainerView>
    )
  }
  
  return (
    <ContainerView>
      <ScrollView refreshControl={
          <RefreshControl refreshing={useMembers.isFetching} onRefresh={() => useMembers.refetch()}/>
      }>
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
        {/* Members */}
        <SectionContainer>
          <SectionTitle>Members</SectionTitle>
          <PaddedContainer>
            <VStack space={useMembers.data.result.length > 0 ? 4 : 0}>
              <FlatList
                  data={useMembers.data.result}
                  keyExtractor={(item) => item.id}
                  ItemSeparatorComponent={() => <DividerWrapper><Divider/></DividerWrapper>}
                  renderItem={({ item }) => (                      
                    <TouchableOpacity onPress={() => {
                      Alert.alert('Coming soon...')
                    }}>
                      <HStack alignItems={'center'}>
                        <HStack space={2}>
                          <Avatar>{getInitials(item?.User.first_name + ' ' + item?.User.last_name)}</Avatar>
                          <MemberNameText>{item?.User.first_name + ' ' + item?.User.last_name + (item?.isYou ? ' (you)' : '')}</MemberNameText>
                        </HStack>
                        <Spacer/>
                        <MemberDisclosureContainer>
                            <ChevronRightIcon />
                        </MemberDisclosureContainer>
                      </HStack>
                    </TouchableOpacity>                   
                  )}
                />
                <Button title='Add Member' onPress={() => {
                  navigation.navigate('AddMemberScreen')
                }}/>
              </VStack>
            </PaddedContainer>
          </SectionContainer>
        </VStack>     
        <PaddedContainer>
          <DefaultButton label='Log out' onPress={signOut}/>
        </PaddedContainer>        
      </ScrollView>
    </ContainerView>
  )
}

const PaddedActivityIndicator = styled.ActivityIndicator`
  padding: 12px;
`

const DividerWrapper = styled.View`
  padding-vertical: 12px;
`

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

const MemberNameText = styled.Text`
  font-size: 17px;
  align-self: center;
`

const MemberDisclosureContainer = styled.View`
  padding-vertical: 16px;
  padding-right: 16px;
`

const ContainerView = styled.View`
  background-color: transparent;
  height: 100%;
  width: 100%;
`

export default TeamScreen
