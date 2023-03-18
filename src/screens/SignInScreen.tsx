import React from 'react'
import { Platform, Linking } from 'react-native'
import { HStack, KeyboardAvoidingView, VStack } from 'native-base'
import styled from 'styled-components/native'
import { StackNavigationProp } from '@react-navigation/stack'
import PhoneInput from 'react-native-phone-number-input'

import { RootStackParamList } from '../../App'
import DefaultButton from '../components/DefaultButton'
import TextButton from '../components/TextButton'
import Links from '../utils/links'

type OnboardingSlideGoalsNavigationProp = StackNavigationProp<RootStackParamList, 'SignInScreen'>

type Props = {
  navigation: OnboardingSlideGoalsNavigationProp
}

const SignInScreen: React.FC<Props> = ({ navigation }) => {

    return (
        <ContainerView>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <VStack space={5} justifyContent={'center'} alignItems={'left'} style={{ height: '100%', marginHorizontal: 10, marginTop: 10 }}>
                    <TitleText>Please enter your phone number.</TitleText>
                    <SubtitleText>Enter your phone number.</SubtitleText>
                    <PhoneInput
                        containerStyle={{ width: '100%' }}
                        defaultCode="US"
                        layout="second"
                        autoFocus
                    />
                    <HStack>
                        <TOSTextWrapper>
                            <TOSText>By tapping next, you agree to our </TOSText>
                            <TextButton label="Terms & Conditions." onPress={onTOS} color='grey' fontSize={12}/>
                        </TOSTextWrapper>
                    </HStack>
                    <DefaultButton label='Continue' disabled={true} onPress={() => {
                        
                    }}/>
                </VStack>
            </KeyboardAvoidingView>
        </ContainerView>
    )
}

const onTOS = async () => {
    await Linking.openURL(Links.terms)
}

const TitleText = styled.Text`
  font-size: 28px;
  font-weight: bold;
`

const SubtitleText = styled.Text`
  font-size: 15px;
  font-weight: regular;
`

const TOSText = styled.Text`
  font-size: 12px;
  color: grey;
`

const TOSTextWrapper = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`

const ErrorText = styled.Text`
  font-size: 12px;5
  color: red;
`

const ContainerView = styled.View`
  background-color: transparent;
  height: 100%;
  width: 100%;
`

export default SignInScreen
