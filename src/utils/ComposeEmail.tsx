import { Linking } from 'react-native'

export const composeEmail = (emailAddress?: string): void => {
    if (emailAddress) {
        let emailUrl = `mailto:${emailAddress}`

        Linking.canOpenURL(emailUrl)
          .then((supported) => {
            if (!supported) {
              console.log(`Email address ${emailAddress} is not available.`)
              return
            }
            return Linking.openURL(emailUrl)
          })
          .catch((err) => console.error('An error occurred', err))
    }
}
