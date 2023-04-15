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

type CreateCustomerResponse = {
    ok: boolean
}

const UseCreateCustomer = (): UseMutationResult<CreateCustomerResponse, Error, CreateCustomerInput> => {
    return useMutation<CreateCustomerResponse, Error, CreateCustomerInput>(async values => {
        return API.createCustomer(values)
    })
}

export default UseCreateCustomer
export type { CreateCustomerInput }