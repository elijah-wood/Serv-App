import { UseMutationResult, useMutation } from 'react-query'
import { API } from './API'

type CreateInvoiceInput = {
    customer_id: string
    job_id: string
    price: number
    due_date: number
    items: InvoiceItem[]
}

type InvoiceItem = {
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
export type { CreateInvoiceInput, InvoiceItem }