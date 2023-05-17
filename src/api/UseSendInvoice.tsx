import { UseMutationResult, useMutation } from 'react-query'
import { API } from './API'
import { CreateInvoiceInput } from './UseCreateInvoice'

type CreateInvoiceResponse = {
    ok: boolean
}

const UseSendInvoice = (invoiceId: string): UseMutationResult<CreateInvoiceResponse, Error, CreateInvoiceInput> => {
    return useMutation<CreateInvoiceResponse, Error, CreateInvoiceInput>(async values => {
        return API.sendInvoice(invoiceId, values)
    })
}

export default UseSendInvoice