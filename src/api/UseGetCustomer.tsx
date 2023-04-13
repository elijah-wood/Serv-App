import { useQuery, UseQueryResult } from 'react-query'
import { API } from './API'
import { Customer } from './UseCustomers'

const UseCustomers = (customerId: string): UseQueryResult<Customer, Error> => {
    return useQuery<Customer, Error>('Customer', async () => {
        return API.getCustomer(customerId)
    })
}

export default UseCustomers
