import { AxiosError } from 'axios'
import { Alert, Linking } from 'react-native'

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

        // If there is a message + 420 status, then handle stripe setup
        if (error?.response?.status == 420) {
          handleStripeSetup(message)
          return Promise.reject(error)
        }

        // Fallback to all other messages
        Alert.alert('Error', message)
    }
    console.log(response)  

    return Promise.reject(error)
}

const handleStripeSetup = (message: string): void => {
  const urlRegex = /(https?:\/\/[^\s]+)/
  const urlMatch = message.match(urlRegex)

  if (urlMatch) {
    const url = urlMatch[0]
    const updatedMessage = message.replace(url, '')

    Alert.alert(
      'Continue Setup',
      updatedMessage,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Set Up Stripe',
          onPress: () => {
            Linking.openURL(url)
          },
        },
      ],
      { cancelable: true }
    );
  }
}