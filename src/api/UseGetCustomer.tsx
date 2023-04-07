import { UseMutationResult, useMutation } from 'react-query'
import { API } from './API'
import { Customer } from './UseCustomers'

const UseCustomers = (customerId: string): UseMutationResult<Customer, Error, void> => {
    return useMutation<Customer, Error, void>(async () => {
        return API.getCustomer(customerId)
    })
}

export default UseCustomers
