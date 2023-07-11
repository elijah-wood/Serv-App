import { UseMutationResult, useMutation } from 'react-query'
import { API } from './API'
import { InvoiceEstimateItem } from './UseCreateInvoice'

type CreateEstimateInput = {
    send?: boolean
    customer_id: string
    job_id: string
    price: number
    notes?: string
    items: InvoiceEstimateItem[]
}

type CreateInvoiceResponse = {
    ok: boolean
}

const UseCreateEstimate = (): UseMutationResult<CreateInvoiceResponse, Error, CreateEstimateInput> => {
    return useMutation<CreateInvoiceResponse, Error, CreateEstimateInput>(async values => {
        return API.createEstimate(values)
    })
}

export default UseCreateEstimate
export { CreateEstimateInput }