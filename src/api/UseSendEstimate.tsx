import { UseMutationResult, useMutation } from 'react-query'
import { API } from './API'
import { InvoiceEstimateItem } from './UseCreateInvoice'

type SendEstimateInput = {    
    customer_id: string
    job_id: string
    price: number
    notes?: string
    items: InvoiceEstimateItem[]
}

type CreateInvoiceResponse = {
    ok: boolean
}

const UseSendEstimate = (estimateId: string): UseMutationResult<CreateInvoiceResponse, Error, SendEstimateInput> => {
    return useMutation<CreateInvoiceResponse, Error, SendEstimateInput>(async values => {
        return API.sendEstimate(estimateId, values)
    })
}

export default UseSendEstimate
export { SendEstimateInput }