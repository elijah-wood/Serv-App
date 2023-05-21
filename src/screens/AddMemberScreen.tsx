import React, { useEffect } from 'react'
import { Alert, DeviceEventEmitter, Platform } from 'react-native'
import { KeyboardAvoidingView, VStack } from 'native-base'
import styled from 'styled-components/native'
import { StackNavigationProp } from '@react-navigation/stack'
import PhoneInput from 'react-native-phone-number-input'
import { useForm, Controller } from "react-hook-form"

import { RootStackParamList } from '../../App'
import DefaultButton from '../components/DefaultButton'
import UseAddMember from '../api/UseAddMember'

type NavigationProp = StackNavigationProp<RootStackParamList, 'SignInScreen'>

type Props = {
  navigation: NavigationProp
}

const AddMemberScreen: React.FC<Props> = ({ navigation }) => {
  const useAddMember = UseAddMember()
  
  const { control, handleSubmit, formState: { errors }, getValues } = useForm({
    defaultValues: {
      phone: '',
    }
  })

  useEffect(() => {
    switch (useAddMember.status) {
      case 'success':
        if (useAddMember.data.result) {
            // Member exists
            Alert.alert('Team member has been added!')
        } else {
            // Member invited
            Alert.alert('Team member has been invited!', 'They will appear in the Team tab when they complete sign up.')
        }
        DeviceEventEmitter.emit("event.refetchTeamMembers")
        navigation.goBack()
        break
      default:
        break
    }
  }, [useAddMember])

  const onSubmit = () => { 
    useAddMember.mutate({ phone: getValues('phone') })
  }

  return (
      <ContainerView>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <VStack space={5} justifyContent={'center'} style={{ height: '100%', marginHorizontal: 10, marginTop: 10 }}>
                  <TitleText>Please enter your team member's phone number.</TitleText>
                  <SubtitleText>They will be sent an invite link and will show in the Team tab when they complete sign up.</SubtitleText>
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
                  <DefaultButton label='Continue' disabled={Object.keys(errors).length === 0 ? false : true} onPress={handleSubmit(onSubmit)} loading={useAddMember.isLoading}/>
              </VStack>
          </KeyboardAvoidingView>
      </ContainerView>
  )
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

export default AddMemberScreen
