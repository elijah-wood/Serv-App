import React, { useCallback, useEffect } from 'react'
import styled from 'styled-components/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { VStack } from 'native-base'
import { Controller, useForm } from 'react-hook-form'
import { DeviceEventEmitter, Keyboard } from 'react-native'
import { RouteProp, useFocusEffect } from '@react-navigation/native'
import SelectDropdown from 'react-native-select-dropdown'

import { RootStackParamList } from '../../App'
import DefaultButton from '../components/DefaultButton'
import { Address } from '../api/UseCustomers'
import UseCreateJob from '../api/UseCreateJob'

type NavigationProp = StackNavigationProp<RootStackParamList, 'AddJobScreen'>
type JobRouteProp = RouteProp<RootStackParamList, 'AddJobScreen'>

type Props = {
  navigation: NavigationProp
  route: JobRouteProp
}

const AddJobScreen: React.FC<Props> = ({ navigation, route }) => {
  const useCreateJob = UseCreateJob()
  const { customerId } = route.params
   
  const { control, handleSubmit, formState: { errors }, getValues, setFocus } = useForm({
    defaultValues: {
      name: '',
      description: '',
      type: '',
      status: 'prospect',
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
        DeviceEventEmitter.emit("event.refetchJobs")
        navigation.goBack()
        break
      default:
        break
    }
  }, [useCreateJob])

  const onSubmit = () => { 
    Keyboard.dismiss()
    useCreateJob.mutate({
      name: getValues('name'),
      customer_id: customerId,
      description: getValues('description'),
      home_size: getValues('home_size'),
      bedrooms: getValues('bedrooms'),
      bathrooms: getValues('bathrooms'),
      status: getValues('status').toLowerCase(),
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
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>
        <VStack space={5}>
          <VStack>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInputWrapper>
                  {errors.name && <ErrorIndicator/>}
                  <TextInput
                      onChangeText={onChange}
                      value={value}
                      onBlur={onBlur}
                      autoCapitalize={'words'}
                      placeholder="Job name"                                      
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
                  <SelectDropdown
                    data={['Prospect', 'Estimated', 'Scheduled', 'Invoiced', 'Completed']}
                    onSelect={(selectedItem) => {
                      onChange(selectedItem)
                    }}
                    buttonStyle={{ backgroundColor: 'white', width: '100%' }}
                    buttonTextStyle={{ textAlign: 'left', fontSize: 16, marginLeft: 3 }}
                    defaultValue={'Prospect'}
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
                      placeholder="Type (optional)"
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
                  {errors.description && <ErrorIndicator/>}
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
                  required: false,
                }}
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInputWrapper>
                    <TextInput
                        onChangeText={onChange}
                        value={value}
                        onBlur={onBlur}
                        placeholder="Home size (optional)"            
                    />
                  </TextInputWrapper>
                )}
                name="home_size"
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
                        placeholder="Bedrooms (optional)"            
                    />
                  </TextInputWrapper>
                )}
                name="bedrooms"
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
                        placeholder="Bathrooms (optional)"            
                    />
                  </TextInputWrapper>
                )}
                name="bathrooms"
              />
          </VStack>
          <AddButtonWrapper>
            <DefaultButton label='Create new job' disabled={Object.keys(errors).length === 0 ? false : true} onPress={handleSubmit(onSubmit)} loading={useCreateJob.isLoading}/>
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
  font-size: 16px;
  flex: 1;
`

const AddButtonWrapper = styled.View`
  padding-horizontal: 12px;
`

export default AddJobScreen
