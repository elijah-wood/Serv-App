import { UseMutationResult, useMutation } from 'react-query'
import { API } from './API'
import { Address } from './UseCustomers'

type UpdateCustomerInput = {
    phone: string
    email: string
    first_name: string
    last_name: string
    profile_image_url: string
    address: Address
}

type UpdateCustomerResponse = {
    ok: boolean
}

const UseUpdateCustomer = (customerId: string): UseMutationResult<UpdateCustomerResponse, Error, UpdateCustomerInput> => {
    return useMutation<UpdateCustomerResponse, Error, UpdateCustomerInput>(async values => {
        return API.updateCustomer(customerId, values);
    })
}

export default UseUpdateCustomer
export type { UpdateCustomerInput }