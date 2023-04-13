import { UseMutationResult, useMutation } from 'react-query'
import { API } from './API'
import { Address } from './UseCustomers'

type CreateCustomerInput = {
    phone: string
    email: string
    first_name: string
    last_name: string
    profile_image_url: string
    address: Address
}

const UseCreateCustomer = (): UseMutationResult<number, Error, CreateCustomerInput> => {
    return useMutation<number, Error, CreateCustomerInput>(async values => {
        return API.createCustomer(values)
    })
}

export default UseCreateCustomer
export type { CreateCustomerInput }