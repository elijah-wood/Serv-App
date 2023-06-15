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
import { Address, Customer } from '../api/UseCustomers'
import { RouteProp } from '@react-navigation/native'
import { Item } from 'react-navigation-header-buttons'

type NavigationProp = StackNavigationProp<RootStackParamList, 'AddCustomerScreen'>
type AddCustomerRouteProp = RouteProp<RootStackParamList, 'AddCustomerScreen'>

type Props = {
  navigation: NavigationProp,
  route: AddCustomerRouteProp
}

const AddCustomerScreen: React.FC<Props> = ({ navigation, route }) => {
  const customer: Customer = route?.params?.customer ?? null;
  const isEditMode = customer !== null;

  useEffect(() => {
    if (isEditMode) {
      navigation.setOptions({
        headerLeft: () => <Item title='Cancel' onPress={() => navigation.goBack()} />,
        headerTitle: 'Edit Customer'
      });
    }
  }, [navigation, isEditMode]);

  const useCreateCustomer = UseCreateCustomer()
  
  const { control, handleSubmit, formState: { errors }, getValues, setFocus } = useForm({
    defaultValues: {
      firstName: customer?.first_name ?? '',
      lastName: customer?.last_name ?? '',
      phone: customer?.phone ?? '',
      email: customer?.email ?? '',
      address1: customer?.address?.line1 ?? '',
      address2: customer?.address?.line2 ?? '',
      city: customer?.address?.city ?? '',
      state: customer?.address?.state ?? '',
      zip: customer?.address?.postal_code ?? ''
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

  const isLoading = useCreateCustomer.isLoading;

  return (
    <ContainerView>
      <KeyboardAwareScrollView 
      showsVerticalScrollIndicator={false} 
      keyboardShouldPersistTaps={'always'}
      >
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
                      autoCapitalize={'words'}                    
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
                      autoCapitalize={'words'}
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
                      onChangeFormattedText={onChange}
                      value={value}
                      placeholder="Phone"
                      defaultCode="US"
                      layout="second"
                      countryPickerButtonStyle={{ backgroundColor: 'white' }}
                      textContainerStyle={{ backgroundColor: 'white' }}  
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
                      keyboardType='email-address'
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
                      autoCapitalize={'words'}
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
                      autoCapitalize={'words'}
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
                      autoCapitalize={'words'}
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
                      autoCapitalize={'words'}
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
                      keyboardType='number-pad'
                      returnKeyType="done"
                  />
                </TextInputWrapper>
              )}
              name="zip"
            />
          </VStack>
          <AddButtonWrapper>
          <DefaultButton label={isEditMode ? 'Save' : 'Add new customer'} disabled={Object.keys(errors).length === 0 ? false : true} onPress={handleSubmit(onSubmit)} loading={isLoading}/>
          </AddButtonWrapper>
          
        </VStack>
      </KeyboardAwareScrollView>
    </ContainerView>
  )
}

const ContainerView = styled.View`
  background-color: #f4f4f4;
  height: 100%;
  width: 100%;
  padding-vertical: 12px;
`

const ErrorIndicator = styled.View`
  position: absolute;
  background: #e96245;
  height: 100%
  width: 8px;
  right: 0px;
`

const TextInputWrapper = styled.View`
  background-color: white;
  height: 54px;
`

const TextInput = styled.TextInput`
  margin-left: 10px;
  margin-right: 10px;
  font-size: 16px;
  flex: 1;
`

const AddButtonWrapper = styled.View`
  padding-horizontal: 12px;
`

export default AddCustomerScreen
