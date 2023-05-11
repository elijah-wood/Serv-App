import { AxiosError } from 'axios'
import { Alert } from 'react-native'

import { logOut } from '../navigation/RootNavigator'

declare module 'axios' {
  export interface AxiosRequestConfig {
    errorHandlerEnabled?: boolean
  }
}

type ErrorResponse = {
    ok: boolean
    error: string
}

export const errorResponseHandler = (error: AxiosError): Promise<never> => {
    // Check for errorHandlerEnabled config)
    if (error?.response?.status == 403) {
      logOut()
      return Promise.reject(error)
    }
    
    let response = error?.response?.data as ErrorResponse
    let message = "Unknown error."
    if (response) {
        message = response.error
        Alert.alert('Error', message)
    }
    console.log(response)  

    return Promise.reject(error)
}
