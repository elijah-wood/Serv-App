import { UseMutationResult, useMutation } from 'react-query'
import { API } from './API'
import { Address } from './UseCustomers'

type CreateJobInput = {
    name: string
    customer_id: string
    description: string
    home_size: string
    bedrooms: string
    bathrooms: string
    address: Address
    type: string
    status: string
}

type CreateJobResponse = {
    ok: boolean
}

const UseCreateJob = (): UseMutationResult<CreateJobResponse, Error, CreateJobInput> => {
    return useMutation<CreateJobResponse, Error, CreateJobInput>(async values => {
        return API.createJob(values)
    })
}

export default UseCreateJob
export type { CreateJobInput }