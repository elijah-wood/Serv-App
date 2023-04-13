import { UseMutationResult, useMutation } from 'react-query'
import { API } from './API'
import { Address } from './UseCustomers'

type CreateJobInput = {
    name: string
    customer_id: string
    description: string
    type: string
    home_size: string
    bedrooms: string
    bathrooms: string
    address: Address
}

const UseCreateJob = (): UseMutationResult<number, Error, CreateJobInput> => {
    return useMutation<number, Error, CreateJobInput>(async values => {
        return API.createJob(values)
    })
}

export default UseCreateJob
export type { CreateJobInput }