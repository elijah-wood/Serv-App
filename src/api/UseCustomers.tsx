import { useQuery, UseQueryResult } from 'react-query'
import { API } from './API'
import { Job } from './UseJobs'
import { UserResponse } from './UserResponse'

type Customer = {
    id: string
    phone?: string
    email?: string
    first_name?: string
    last_name?: string
    profile_image_url?: string
    address?: Address
    twilio_conversation_sid: string
    Job: Job[]
    Collaborator: Collaborator[]
}  

type Collaborator = {
    id: string
    Member: Member
    isYou?: boolean
}

type Member = {
    id: string
    User: UserResponse
    isYou?: boolean
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
    }, { retry: 0 })
}

export default UseCustomers
export type { Customer, Address, UseCustomersResult, Member, Collaborator }