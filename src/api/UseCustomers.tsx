import { useQuery, UseQueryResult } from 'react-query'
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

type UseCustomersResult = {
    ok: boolean
    result: Customer[]
}

const UseCustomers = (): UseQueryResult<UseCustomersResult, Error> => {
    return useQuery<UseCustomersResult, Error>('Customers', async () => {
        return API.getCustomers()
    })
}

export default UseCustomers
export type { Customer, Address, UseCustomersResult }