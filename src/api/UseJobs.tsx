import { useQuery, UseQueryResult } from 'react-query'
import { API } from './API'
import { Address, Customer } from './UseCustomers'
import { InvoiceEstimateItem } from './UseCreateInvoice'

type Job = {
    id: string
    name?: string
    description?: string
    notes?: string
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
    Estimate: Estimate[]
    Photo: Photo[]
}  

type Invoice = {
    id: string
    created_at?: string
    due_date?: string
    job_id: string
    status: string
    InvoiceItem: InvoiceEstimateItem[]
    Payment: Payment[]
}

type Estimate = {
    id: string
    status: string
    EstimateItem: InvoiceEstimateItem[]
    created_at?: string
    job_id: string    
}

type Photo = {
    id: string
    url?: string
    created_at?: string
}

type Payment = {
    id: string
}

type UseJobsResponse = {
    ok: boolean
    result: Job[]
}

const UseJobs = (): UseQueryResult<UseJobsResponse, Error> => {
    return useQuery<UseJobsResponse, Error>('Jobs', async () => {
        return API.getJobs()
    }, { retry: 0 })
}

export default UseJobs
export type { Job, Invoice, Estimate, Photo, Payment, UseJobsResponse }