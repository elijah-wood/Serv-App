import React, { useEffect } from 'react'
import styled from 'styled-components/native'
import { StackNavigationProp } from '@react-navigation/stack'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { VStack } from 'native-base'
import { Controller, useForm } from 'react-hook-form'
import PhoneInput from 'react-native-phone-number-input'
import { DeviceEventEmitter } from 'react-native'

import { RootStackParamList } from '../../App'
import DefaultButton from '../components/DefaultButton'
import UseCreateCustomer from '../api/UseCreateCustomer'
import { Address } from '../api/UseCustomers'

type NavigationProp = StackNavigationProp<RootStackParamList, 'AddCustomerScreen'>

type Props = {
  navigation: NavigationProp
}

const AddCustomerScreen: React.FC<Props> = ({ navigation }) => {
  const useCreateCustomer = UseCreateCustomer()
  
  const { control, handleSubmit, formState: { errors }, getValues } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: ''
    }
  })

  useEffect(() => {
    switch (useCreateCustomer.status) {
      case 'success':
        DeviceEventEmitter.emit("event.refetchCustomers")
        navigation.goBack()
        break
      default:
        break
    }
  }, [useCreateCustomer.status])

  const onSubmit = () => { 
    useCreateCustomer.mutate({
      phone: getValues('phone'),
      email: getValues('email'),
      first_name: getValues('firstName'),
      last_name: getValues('lastName'),
      profile_image_url: '',
      address: { 
        line1: getValues('address1'),
        line2: getValues('address2'),
        city: getValues('city'),
        state: getValues('state'),
        postal_code: getValues('zip'),
      } as Address
    })
  }

  return (
    <ContainerView>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <VStack space={5}>
          <VStack>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInputWrapper>
                  {errors.firstName && <ErrorIndicator/>}
                  <TextInput
                      onChangeText={onChange}
                      value={value}
                      onBlur={onBlur}
                      placeholder="First name"
                  />
                </TextInputWrapper>
              )}
              name="firstName"
            />
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInputWrapper>
                  {errors.lastName && <ErrorIndicator/>}
                  <TextInput
                      onChangeText={onChange}
                      value={value}
                      onBlur={onBlur}
                      placeholder="Last name"
                  />
                </TextInputWrapper>
              )}
              name="lastName"
            />
            <Controller
              control={control}
              rules={{
                required: true,
                pattern: {
                  value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/i,
                  message: 'Invalid phone number.'
                }
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInputWrapper>
                  {errors.phone && <ErrorIndicator/>}
                  <PhoneInput
                      onChangeText={onChange}
                      value={value}
                      placeholder="Phone"
                      defaultCode="US"
                      layout="second"
                      countryPickerButtonStyle={{ backgroundColor: '#eaeaea' }}
                  />
                </TextInputWrapper>
              )}
              name="phone"
            />
            <Controller
              control={control}
              rules={{
                required: true,
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                  message: 'Invalid email.'
                }
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInputWrapper>
                  {errors.email && <ErrorIndicator/>}
                  <TextInput
                      onChangeText={onChange}
                      value={value}
                      onBlur={onBlur}
                      placeholder="Email"
                      autoCapitalize="none"
                  />
                </TextInputWrapper>
              )}
              name="email"
            />
          </VStack>
          { /*Address */ }
          <VStack>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInputWrapper>
                  {errors.address1 && <ErrorIndicator/>}
                  <TextInput
                      onChangeText={onChange}
                      value={value}
                      onBlur={onBlur}
                      placeholder="Address 1"
                  />
                </TextInputWrapper>
              )}
              name="address1"
            />
            <Controller
              control={control}
              rules={{
                required: false,
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInputWrapper>
                  {errors.address2 && <ErrorIndicator/>}
                  <TextInput
                      onChangeText={onChange}
                      value={value}
                      onBlur={onBlur}
                      placeholder="Address 2 (optional)"
                  />
                </TextInputWrapper>
              )}
              name="address2"
            />
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInputWrapper>
                  {errors.city && <ErrorIndicator/>}
                  <TextInput
                      onChangeText={onChange}
                      value={value}
                      onBlur={onBlur}
                      placeholder="City"
                  />
                </TextInputWrapper>
              )}
              name="city"
            />
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInputWrapper>
                  {errors.state && <ErrorIndicator/>}
                  <TextInput
                      onChangeText={onChange}
                      value={value}
                      onBlur={onBlur}
                      placeholder="State"
                  />
                </TextInputWrapper>
              )}
              name="state"
            />
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInputWrapper>
                  {errors.zip && <ErrorIndicator/>}
                  <TextInput
                      onChangeText={onChange}
                      value={value}
                      onBlur={onBlur}
                      placeholder="Zip"
                  />
                </TextInputWrapper>
              )}
              name="zip"
            />
          </VStack>
          <DefaultButton label='Add new customer' disabled={Object.keys(errors).length === 0 ? false : true} onPress={handleSubmit(onSubmit)} loading={useCreateCustomer.isLoading}/>
        </VStack>
      </KeyboardAwareScrollView>
    </ContainerView>
  )
}

const ContainerView = styled.View`
  background-color: white;
  height: 100%;
  width: 100%;
  padding: 12px;
`

const ErrorIndicator = styled.View`
  position: absolute;
  background: red;
  height: 100%
  width: 10px;
  right: 0px;
`

const TextInputWrapper = styled.View`
  background-color: #F8F9F9;
  height: 54px;
`

const TextInput = styled.TextInput`
  margin-left: 10px;
  margin-right: 10px;
  font-size: 16px;
  flex: 1;
`

const ErrorText = styled.Text`
  font-size: 12px;
  color: red;
`

export default AddCustomerScreen
