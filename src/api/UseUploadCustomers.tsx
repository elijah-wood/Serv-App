import { UseMutationResult, useMutation } from 'react-query'
import { API } from './API'
import { Customer } from './UseCustomers'

type UploadCustomersInput = Customer[]

type UploadCustomersResponse = {
    ok: boolean
}

const UseUploadCustomers = (): UseMutationResult<UploadCustomersResponse, Error, UploadCustomersInput> => {
    return useMutation<UploadCustomersResponse, Error, UploadCustomersInput>(async values => {
        return API.uploadCustomers(values);
    })
}

export default UseUploadCustomers
export type { UploadCustomersInput }