import { AxiosError } from 'axios'
import { Alert } from 'react-native'

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
    let response = error?.response?.data as ErrorResponse
    let message = "Unknown error."
    if (response) {
        message = response.error
    }
    Alert.alert('Error', message)

    return Promise.reject(error)
}
