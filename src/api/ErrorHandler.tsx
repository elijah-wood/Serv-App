import { AxiosError } from 'axios'
import { Alert } from 'react-native'

declare module 'axios' {
  export interface AxiosRequestConfig {
    errorHandlerEnabled?: boolean
  }
}

export const errorResponseHandler = (error: AxiosError): Promise<never> => {
  // Check for errorHandlerEnabled config
  if (error?.config.hasOwnProperty('errorHandlerEnabled') && error?.config.errorHandlerEnabled === true) {
    const message = error.message //error?.response?.data?.errors?.length > 0 ? error?.response?.data.errors[0].message : error.message
    Alert.alert('Error', message)
  }

  return Promise.reject(error)
}
