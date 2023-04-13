import { UseMutationResult, useMutation } from 'react-query'
import { API } from './API'
import { Address, Customer } from './UseCustomers'
import { UserResponse } from './UserResponse'

type Job = {
    id: string
    name?: string
    description?: string
    status?: string
    customer_id: string
    home_size?: string
    bedrooms?: string
    bathrooms?: string
    team_id: string
    address?: Address
    type?: string
    Customer: Customer
    Invoice: Invoice[]
    Photo: Photo[]
    Team: Team
}  

type Invoice = {
    id: string
    price: number
    number: string
    created_at?: string
    job_id: string
    Payment: Payment[]
}

type Photo = {
    id: string
    url?: string
    created_at?: string
}

type Team = {
    id: string
    name: string
    website?: string
    User: UserResponse[]
}

type Payment = {
    id: string
}

const UseJobs = (): UseMutationResult<Job[], Error, void> => {
    return useMutation<Job[], Error, void>(async () => {
        return API.getJobs()
    })
}

export default UseJobs
export type { Job, Invoice, Photo, Team, Payment }