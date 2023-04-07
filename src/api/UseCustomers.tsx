import { UseMutationResult, useMutation } from 'react-query'
import { API } from './API'
import { Job } from './UseJobs'

type Customer = {
    id: string
    phone?: string
    email?: string
    full_name?: string
    first_name?: string
    last_name?: string
    profile_image_url?: string
    address?: string
    twilio_conversations_sid: string
    Job: Job[]
}  

const UseCustomers = (): UseMutationResult<Customer[], Error, void> => {
    return useMutation<Customer[], Error, void>(async () => {
        return API.getCustomers()
    })
}

export default UseCustomers
export type { Customer }