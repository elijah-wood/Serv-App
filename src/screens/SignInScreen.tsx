import React from 'react'
import { Platform, Linking } from 'react-native'
import { HStack, KeyboardAvoidingView, VStack } from 'native-base'
import styled from 'styled-components/native'
import { StackNavigationProp } from '@react-navigation/stack'
import PhoneInput from 'react-native-phone-number-input'
import { useForm, Controller } from "react-hook-form"

import { RootStackParamList } from '../../App'
import DefaultButton from '../components/DefaultButton'
import TextButton from '../components/TextButton'
import Links from '../utils/links'

type OnboardingSlideGoalsNavigationProp = StackNavigationProp<RootStackParamList, 'SignInScreen'>

type Props = {
  navigation: OnboardingSlideGoalsNavigationProp
}

const SignInScreen: React.FC<Props> = ({ navigation }) => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      phone: '',
    }
  })

  const onSubmit = data => console.log(data)

    return (
        <ContainerView>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <VStack space={5} justifyContent={'center'} style={{ height: '100%', marginHorizontal: 10, marginTop: 10 }}>
                    <TitleText>Please enter your phone number.</TitleText>
                    <SubtitleText>Enter your phone number.</SubtitleText>
                    {errors.phone && <ErrorText>{errors.phone.message ? errors.phone.message : 'This is required.'}</ErrorText>}
                    <Controller
                      control={control}
                      rules={{
                        required: true,
                        pattern: {
                          value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/i,
                          message: 'Invalid phone number.'
                        }
                      }}
                      render={({ field: { onChange, value } }) => (
                        <PhoneInput
                          containerStyle={{ width: '100%' }}
                          value={value}
                          onChangeText={onChange}
                          defaultCode="US"
                          layout="second"
                          autoFocus
                        />
                      )}
                      name="phone"
                    />
                    <HStack>
                        <TOSTextWrapper>
                            <TOSText>By tapping next, you agree to our </TOSText>
                            <TextButton label="Terms & Conditions." onPress={onTOS} color='grey' fontSize={12}/>
                        </TOSTextWrapper>
                    </HStack>
                    <DefaultButton label='Continue' disabled={Object.keys(errors).length === 0 ? false : true} onPress={handleSubmit(onSubmit)}/>
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
  font-size: 12px;
  color: red;
`

const ContainerView = styled.View`
  background-color: transparent;
  height: 100%;
  width: 100%;
`

export default SignInScreen
