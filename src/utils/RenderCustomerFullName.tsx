import { Customer } from "../api/UseCustomers"

export const renderCustomerFullName = (customer?: Customer) => {
    if (customer) {
        const { first_name, last_name } = customer
  
        return `${first_name} ${last_name}`
    } else {
        return ''
    }
}