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
        if (message.includes("Please visit")) {
          handleStripeSetup(message)
          return
        }
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
          text: 'Set up Stripe',
          onPress: () => {
            Linking.openURL(url)
          },
        },
      ],
      { cancelable: true }
    );
  }
}