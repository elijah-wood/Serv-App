import { UseMutationResult, useMutation } from 'react-query'
import { API } from './API'

type CreateInvoiceInput = {
    items: InvoiceItem[]
}

type InvoiceItem = {
    description: string
    unit_amount: number
    amount: number
}

type CreateInvoiceResponse = {
    ok: boolean
}

const UseCreateInvoice = (): UseMutationResult<CreateInvoiceResponse, Error, CreateInvoiceInput> => {
    return useMutation<CreateInvoiceResponse, Error, CreateInvoiceInput>(async values => {
        console.log(values)
        return API.createInvoice(values)
    })
}

export default UseCreateInvoice
export type { CreateInvoiceInput, InvoiceItem }