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
      status: '',
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
      home_size: getValues('home_size'),
      bedrooms: getValues('bedrooms'),
      bathrooms: getValues('bathrooms'),
      status: getValues('status'),
      type: getValues('type'),
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
                }}
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInputWrapper>
                    <TextInput
                        onChangeText={onChange}
                        value={value}
                        onBlur={onBlur}
                        placeholder="Status"
                    />
                  </TextInputWrapper>
                )}
                name="status"
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
                        placeholder="Type"
                    />
                  </TextInputWrapper>
                )}
                name="type"
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
                        placeholder="Description"

                    />
                  </TextInputWrapper>
                )}
                name="description"
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
            {/* Home */}
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
                          placeholder="Home size"            
                      />
                    </TextInputWrapper>
                  )}
                  name="home_size"
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
                          placeholder="Bedrooms"            
                      />
                    </TextInputWrapper>
                  )}
                  name="bedrooms"
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
                          placeholder="Bathrooms"            
                      />
                    </TextInputWrapper>
                  )}
                  name="bathrooms"
                />
            </VStack>
            <DefaultButton label='Create new job' disabled={Object.keys(errors).length === 0 ? false : true} onPress={handleSubmit(onSubmit)} loading={useCreateJob.isLoading}/>
          </VStack>
        </KeyboardAvoidingView>
      </ScrollView>
    </ContainerView>
  )
}

const ScrollView = styled.ScrollView``

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
