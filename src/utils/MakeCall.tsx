import { Linking, Platform } from 'react-native';

export const makeCall = (phoneNumber?: string): void => {
    if (phoneNumber) {
        let phoneNumberWithPrefix = ''

        if (Platform.OS === 'android') {
          phoneNumberWithPrefix = `tel:${phoneNumber}`
        } else {
          phoneNumberWithPrefix = `telprompt:${phoneNumber}`
        }
      
        Linking.canOpenURL(phoneNumberWithPrefix)
          .then((supported) => {
            if (!supported) {
              console.log(`Phone number ${phoneNumber} is not available.`)
              return;
            }
            return Linking.openURL(phoneNumberWithPrefix)
          })
          .catch((err) => console.error('An error occurred', err))
    }
}
