import React, { useEffect } from 'react'
import styled from 'styled-components/native'
import { StackNavigationProp } from '@react-navigation/stack'

import { KeyboardAvoidingView, Platform } from 'react-native'
import { VStack } from 'native-base'
import { Controller, useForm } from 'react-hook-form'

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
        navigation.goBack()
        break
      default:
        break
    }
  }, [useCreateCustomer.isLoading])

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
      <ScrollView>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <VStack space={5}>
            <VStack>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInputWrapper>
                    <TextInput
                        onChangeText={onChange}
                        autoFocus={true}
                        value={value}
                        onBlur={onBlur}
                        placeholder="First name"
                        textContentType="givenName"
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
                    <TextInput
                        onChangeText={onChange}
                        value={value}
                        onBlur={onBlur}
                        placeholder="Last name"
                        textContentType="familyName"
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
                    <TextInput
                        onChangeText={onChange}
                        value={value}
                        onBlur={onBlur}
                        placeholder="Phone"
                        textContentType="telephoneNumber"
                    />
                  </TextInputWrapper>
                )}
                name="phone"
              />
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInputWrapper>
                    <TextInput
                        onChangeText={onChange}
                        value={value}
                        onBlur={onBlur}
                        placeholder="Email"
                        autoCapitalize="none"
                        textContentType="emailAddress"
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
                    <TextInput
                        onChangeText={onChange}
                        value={value}
                        onBlur={onBlur}
                        placeholder="Address 1"
                        textContentType="streetAddressLine1"
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
                    <TextInput
                        onChangeText={onChange}
                        value={value}
                        onBlur={onBlur}
                        placeholder="Address 2"
                        textContentType="streetAddressLine2"
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
                    <TextInput
                        onChangeText={onChange}
                        value={value}
                        onBlur={onBlur}
                        placeholder="City"
                        textContentType="addressCity"
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
                    <TextInput
                        onChangeText={onChange}
                        value={value}
                        onBlur={onBlur}
                        placeholder="State"
                        textContentType="addressState"
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
                    <TextInput
                        onChangeText={onChange}
                        value={value}
                        onBlur={onBlur}
                        placeholder="Zip"
                        textContentType="postalCode"
                    />
                  </TextInputWrapper>
                )}
                name="zip"
              />
            </VStack>
            <DefaultButton label='Add new customer' disabled={Object.keys(errors).length === 0 ? false : true} onPress={handleSubmit(onSubmit)} loading={useCreateCustomer.isLoading}/>
          </VStack>
        </KeyboardAvoidingView>
      </ScrollView>
    </ContainerView>
  )
}

const ContainerView = styled.View`
  background-color: white;
  height: 100%;
  width: 100%;
  padding: 10px;
`

const ScrollView = styled.ScrollView`
`

const TextInputWrapper = styled.View`
  background-color: #F8F9F9;
  height: 54px;
`

const TextInput = styled.TextInput`
  margin-left: 10px;
  font-size: 16px;
  flex: 1;
`

const ErrorText = styled.Text`
  font-size: 12px;
  color: red;
`

export default AddCustomerScreen
