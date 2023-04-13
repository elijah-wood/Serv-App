import React, { useEffect } from 'react'
import styled from 'styled-components/native'
import { StackNavigationProp } from '@react-navigation/stack'

import { KeyboardAvoidingView, Platform } from 'react-native';
import { VStack } from 'native-base'
import { Controller, useForm } from 'react-hook-form'

import { RootStackParamList } from '../../App'
import DefaultButton from '../components/DefaultButton'
import { Address } from '../api/UseCustomers'
import UseCreateJob from '../api/UseCreateJob';

type NavigationProp = StackNavigationProp<RootStackParamList, 'AddJobScreen'>

type Props = {
  navigation: NavigationProp
}

const AddJobScreen: React.FC<Props> = ({ navigation }) => {
  const useCreateJob = UseCreateJob()
  
  const { control, handleSubmit, formState: { errors }, getValues } = useForm({
    defaultValues: {
      name: '',
      customer_id: '',
      description: '',
      type: '',
      home_size: '',
      bedrooms: '',
      bathrooms: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: ''
    }
  })

  useEffect(() => {
    switch (useCreateJob.status) {
      case 'success':
        navigation.goBack()
        break
      default:
        break
    }
  }, [useCreateJob])

  const onSubmit = () => { 
    useCreateJob.mutate({
      name: getValues('name'),
      customer_id: getValues('customer_id'),
      description: getValues('description'),
      type: getValues('type'),
      home_size: getValues('home_size'),
      bedrooms: getValues('bedrooms'),
      bathrooms: getValues('bathrooms'),
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
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <VStack space={5}>
        {errors && <ErrorText>{'Form has errors.'}</ErrorText>}
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
                      placeholder="Name"                
                  />
                </TextInputWrapper>
              )}
              name="name"
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
                      placeholder="Customer"
                  />
                </TextInputWrapper>
              )}
              name="customer_id"
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
                      placeholder="Description"

                  />
                </TextInputWrapper>
              )}
              name="description"
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
                      placeholder="Type"
                  />
                </TextInputWrapper>
              )}
              name="type"
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
          <DefaultButton label='Create new job' disabled={Object.keys(errors).length === 0 ? false : true} onPress={handleSubmit(onSubmit)} loading={useCreateJob.isLoading}/>
        </VStack>
      </KeyboardAvoidingView>

    </ContainerView>
  )
}

const ContainerView = styled.View`
  background-color: white;
  height: 100%;
  width: 100%;
  padding: 10px;
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

export default AddJobScreen
