import { UseMutationResult, useMutation } from 'react-query'
import { API } from './API'

type CreateInvoiceInput = {
    send?: boolean
    customer_id: string
    job_id: string
    price: number
    due_date: number
    items: InvoiceEstimateItem[]
}

type InvoiceEstimateItem = {
    quantity: number
    description: string
    unit_amount: number
}

type CreateInvoiceResponse = {
    ok: boolean
}

const UseCreateInvoice = (): UseMutationResult<CreateInvoiceResponse, Error, CreateInvoiceInput> => {
    return useMutation<CreateInvoiceResponse, Error, CreateInvoiceInput>(async values => {
        return API.createInvoice(values)
    })
}

export default UseCreateInvoice
export type { CreateInvoiceInput, InvoiceEstimateItem }