const removeNonDigitCharacters = (phoneNumber: string): string => {
    return phoneNumber.replace(/\D/g, '')
}

export const formatPhoneNumber = (phoneNumber: string): string => {
    phoneNumber = removeNonDigitCharacters(phoneNumber)
    const hasLeadingOne = phoneNumber.length > 10 && phoneNumber.charAt(0) === '1'

    if (hasLeadingOne) {
        return `+${phoneNumber}`
    }

    return `+1${phoneNumber}`
}
