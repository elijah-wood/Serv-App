import { setStringAsync } from 'expo-clipboard'
import { Platform, ToastAndroid } from 'react-native'

export const copyText = async (text: string) => {
	await setStringAsync(text)
    if (Platform.OS === 'android' && Platform.Version <= 32) {
        ToastAndroid.show("Copied", ToastAndroid.SHORT)
    }
}
