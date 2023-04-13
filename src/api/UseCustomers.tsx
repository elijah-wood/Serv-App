import { UseMutationResult, useMutation } from 'react-query'
import { API } from './API'
import { Job } from './UseJobs'

type Customer = {
    id: string
    phone?: string
    email?: string
    first_name?: string
    last_name?: string
    profile_image_url?: string
    address?: Address
    twilio_conversations_sid: string
    Job: Job[]
}  

type Address = {
    city: string
    country: string
    line1: string
    line2?: string
    postal_code: string
    state?: string
}

const UseCustomers = (): UseMutationResult<Customer[], Error, void> => {
    return useMutation<Customer[], Error, void>(async () => {
        return API.getCustomers()
    })
}

export default UseCustomers
export type { Customer, Address }