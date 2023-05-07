function formatPhoneNumber(phoneNumber: string): string {
    // Remove any non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Format the phone number as (XXX) XXX-XXXX
    const formatted = cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    
    return formatted;
  }

export const renderPhoneNumber = (phone?: string): string => {
    if (phone) {
        // Remove any non-digit characters
        const cleaned = phone.replace(/\D/g, '')

        // Check if the phone number has a preceding 1
        const hasLeadingOne = cleaned.length > 10 && cleaned.charAt(0) === '1'
        const index = hasLeadingOne ? 1 : 0

        // Format the phone number as (XXX) XXX-XXXX
        const formatted = cleaned.slice(index).replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')

        // Add back the leading 1, if present
        return hasLeadingOne ? `+1 ${formatted}` : formatted
    } else {
        return ''
    }
}