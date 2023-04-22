import { useQuery, UseQueryResult } from 'react-query'
import { API } from './API'
import { Customer } from './UseCustomers'

type UseGetCustomerResponse = {
    ok: boolean
    result: Customer
}

const UseGetCustomer = (customerId: string): UseQueryResult<UseGetCustomerResponse, Error> => {
    return useQuery<UseGetCustomerResponse, Error>('Customer', async () => {
        return API.getCustomer(customerId)
    }, { retry: 0 })
}

export default UseGetCustomer
