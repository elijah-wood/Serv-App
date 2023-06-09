import React, { useEffect } from 'react'
import { Platform, Linking, Alert } from 'react-native'
import { HStack, KeyboardAvoidingView, VStack } from 'native-base'
import styled from 'styled-components/native'
import { StackNavigationProp } from '@react-navigation/stack'
import PhoneInput from 'react-native-phone-number-input'
import { useForm, Controller } from "react-hook-form"

import { RootStackParamList } from '../../App'
import DefaultButton from '../components/DefaultButton'
import TextButton from '../components/TextButton'
import Links from '../utils/links'
import UseSignIn from '../api/UseSignIn'

type NavigationProp = StackNavigationProp<RootStackParamList, 'SignInScreen'>

type Props = {
  navigation: NavigationProp
}

const SignInScreen: React.FC<Props> = ({ navigation }) => {
  const useSignIn = UseSignIn()
  
  const { control, handleSubmit, formState: { errors }, getValues } = useForm({
    defaultValues: {
      phone: '',
    }
  })

  useEffect(() => {
    switch (useSignIn.status) {
      case 'success':
        navigation.navigate('PhoneVerificationScreen', { phone: getValues('phone') })
        break
      default:
        break
    }
  }, [useSignIn])

  const onSubmit = () => { 
    useSignIn.mutate({ phone: getValues('phone') })
  }

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
                        onChangeFormattedText={onChange}
                        defaultCode="US"
                        layout="second"
                        countryPickerButtonStyle={{ backgroundColor: '#eaeaea' }}
                        textContainerStyle={{ backgroundColor: '#f4f4f4' }}
                        autoFocus
                      />
                    )}
                    name="phone"
                  />
                  <HStack>
                      <TOSTextWrapper>
                          <TOSText>By tapping next, you agree to our </TOSText>
                          <TextButton label="Terms & Conditions." onPress={onTOS} color='grey' fontSize={12} underline={true}/>
                      </TOSTextWrapper>
                  </HStack>
                  <DefaultButton label='Continue' disabled={Object.keys(errors).length === 0 ? false : true} onPress={handleSubmit(onSubmit)} loading={useSignIn.isLoading}/>
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
  background-color: white;
  height: 100%;
  width: 100%;
`

export default SignInScreen
