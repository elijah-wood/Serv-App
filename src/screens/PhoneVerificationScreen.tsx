import React, { useEffect } from 'react'
import { Platform } from 'react-native'
import { KeyboardAvoidingView, VStack } from 'native-base'
import styled from 'styled-components/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useForm, Controller } from "react-hook-form"
import { RouteProp, CommonActions } from '@react-navigation/native'

import { RootStackParamList } from '../../App'
import DefaultButton from '../components/DefaultButton'
import TextButton from '../components/TextButton'
import UseCompleteSignIn from '../api/UseCompleteSignIn'
import { setUserSession } from '../api/Session'

type NavigationProp = StackNavigationProp<RootStackParamList, 'PhoneVerificationScreen'>
type PhoneVerificationRouteProp = RouteProp<RootStackParamList, 'PhoneVerificationScreen'>

type Props = {
  navigation: NavigationProp
  route: PhoneVerificationRouteProp
}

const PhoneVerificationScreen: React.FC<Props> = ({ navigation }) => {
  const useCompleteSignIn = UseCompleteSignIn()

  const { control, handleSubmit, formState: { errors }, getValues } = useForm({
      defaultValues: {
        verificationCode: '',
      }
  })

  const onSubmit = () => { 
    useCompleteSignIn.mutate({ verification_token: getValues('verificationCode') })
  }

  useEffect(() => {
    switch (useCompleteSignIn.status) {
      case 'success':
        if (useCompleteSignIn.data) {
          setUserSession(useCompleteSignIn.data)
          navigation.dispatch(
            // Reset stack for Android
            CommonActions.reset({
                index: 1,
                routes: [{ name: 'Home' }],
            })
          )
        }
        break
      default:
        break
    }
  }, [useCompleteSignIn])

  return (
      <ContainerView>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <VStack space={5} justifyContent={'center'} style={{ height: '100%', marginHorizontal: 10, marginTop: 10 }}>
                  <TitleText>Enter the code we just texted you:</TitleText>
                  {errors.verificationCode && <ErrorText>{errors.verificationCode.message ? errors.verificationCode.message : 'This is required.'}</ErrorText>}
                  <Controller
                    control={control}
                    rules={{
                      required: true,
                      pattern: {
                        value: /^\d{6}$/i,
                        message: 'Invalid verification code.'
                      }
                    }}
                    render={({ field: { onChange, value, onBlur } }) => (
                      <CodeInputWrapper>
                          <CodeInput
                              onChangeText={text => {
                                  onChange(text)
                                  if (text.length == 6) {
                                      // Auto submit
                                      onSubmit()
                                  }
                              }}
                              autoFocus={true}
                              value={value}
                              onBlur={onBlur}
                              placeholder="XXX XXX"
                              keyboardType="number-pad"
                              textContentType="oneTimeCode"
                              autocomplete="sms-otp"
                          />
                      </CodeInputWrapper>
                    )}
                    name="verificationCode"
                  />
                  <TextButton label="Send the code again" onPress={sendCodeAgain} color='black' fontSize={15} bold={true}/>
                  <DefaultButton label='Continue' disabled={Object.keys(errors).length === 0 ? false : true} onPress={handleSubmit(onSubmit)} loading={useCompleteSignIn.isLoading}/>
              </VStack>
          </KeyboardAvoidingView>
      </ContainerView>
  )
}

const sendCodeAgain = () => {
    
}

const CodeInputWrapper = styled.View`
  background-color: #F8F9F9;
  height: 54px;
`

const CodeInput = styled.TextInput`
  margin-left: 10px;
  font-size: 16px;
  flex: 1;
`

const TitleText = styled.Text`
  font-size: 28px;
  font-weight: bold;
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

export default PhoneVerificationScreen
