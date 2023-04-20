import { Linking, Platform } from 'react-native'
import { Address } from '../api/UseCustomers'

export const openMap = async (address?: Address) => {
    if (address) {
        const { line1, line2, city, state, postal_code } = address

        const destination = encodeURIComponent(`${line1}${line2 ? line2 : ''}, ${city}, ${state} ${postal_code}`)
        const provider = Platform.OS === 'ios' ? 'apple' : 'google'
        const link = `http://maps.${provider}.com/?daddr=${destination}`
    
        try {
            const supported = await Linking.canOpenURL(link)
    
            if (supported) Linking.openURL(link)
        } catch (error) {
            console.log(error)
        }
    }
}