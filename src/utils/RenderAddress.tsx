import { Address } from "../api/UseCustomers"

export const renderAddress = (address?: Address) => {
    if (address) {
        const { line1, line2, city, state, postal_code } = address
  
        const fullAddress = `${line1}${line2 ? '\n' + line2 : ''}\n${city}, ${state} ${postal_code}`
        
        return fullAddress
    } else {
        return 'Not provided'
    }
}