import APIClient from "./APIClient"
import { AuthenticatedHeaders } from "./AuthenticatedHeaders"
import { AddCollaboratorInput } from "./UseAddCollaborator"
import { AddMemberInput } from "./UseAddMember"
import { CompleteSignInInput } from "./UseCompleteSignIn"
import { CreateCustomerInput } from "./UseCreateCustomer"
import { CreateEstimateInput } from "./UseCreateEstimate"
import { CreateInvoiceInput } from "./UseCreateInvoice"
import { CreateJobInput } from "./UseCreateJob"
import { SendEstimateInput } from "./UseSendEstimate"
import { SignInInput } from "./UseSignIn"
import { UpdateCustomerInput } from "./UseUpdateCustomer"
import { UpdateJobInput } from "./UseUpdateJob"
import { UploadCustomersInput } from "./UseUploadCustomers"

export const API = {
    login: async (values: SignInInput) => {
        const response = await APIClient.post('/login', values)
        return response.data
    },
    completeLogin: async (values: CompleteSignInInput) => {
        const response = await APIClient.post('/complete-login', values)
        return response.data
    },
    refreshToken: async () => {        
        const response = await APIClient.post('/refresh-token', {
            headers: await AuthenticatedHeaders(),
        })    
        return response.data
    },
    getCustomers: async () => {
        const response = await APIClient.get('/customers', {
            headers: await AuthenticatedHeaders(),
        })
        return response.data
    },
    getCustomer: async (id: string) => {
        const response = await APIClient.get(`/customers/${id}`, {
            headers: await AuthenticatedHeaders(),
        })
        return response.data
    },
    createCustomer: async (values: CreateCustomerInput) => {
        const response = await APIClient.post('/customers', values, {
            headers: await AuthenticatedHeaders(),
        })
        return response.data
    },
    updateCustomer: async (id: string, values: UpdateCustomerInput) => {
        const response = await APIClient.patch(`/customers/${id}`, values, {
            headers: await AuthenticatedHeaders(),
        })
        return response.data;
    },
    uploadCustomers: async (values: UploadCustomersInput) => {
        const response = await APIClient.post(`/customers/upload`, values, {
            headers: await AuthenticatedHeaders(),
        })
        return response.data
    },
    getJobs: async () => {
        const response = await APIClient.get('/jobs', {
            headers: await AuthenticatedHeaders(),
        })
        return response.data
    },
    getJob: async (id: string) => {
        const response = await APIClient.get(`/jobs/${id}`, {
            headers: await AuthenticatedHeaders(),
        })
        return response.data
    },    
    createJob: async (values: CreateJobInput) => {
        const response = await APIClient.post('/jobs', values, {
            headers: await AuthenticatedHeaders(),
        })
        return response.data
    },
    updateJob: async (id: string, values: UpdateJobInput) => {
        const response = await APIClient.patch(`/jobs/${id}`, values, {
            headers: await AuthenticatedHeaders(),
        })
        return response.data
    },
    createTwilioAccessToken: async () => {
        const response = await APIClient.post('/twilio/access-token', [], {
            headers: await AuthenticatedHeaders(),
        })
        return response.data
    },
    createInvoice: async (values: CreateInvoiceInput) => {
        const response = await APIClient.post('/invoices', values, {
            headers: await AuthenticatedHeaders(),
        })
        return response.data
    },
    sendInvoice: async (invoiceId: string, values: CreateInvoiceInput) => {
        const response = await APIClient.post(`/invoices/${invoiceId}/send`, values, {
            headers: await AuthenticatedHeaders(),
        })
        return response.data
    },
    createEstimate: async (values: CreateEstimateInput) => {
        const response = await APIClient.post('/estimates', values, {
            headers: await AuthenticatedHeaders(),
        })
        return response.data
    },
    sendEstimate: async (estimateId: string, values: CreateEstimateInput) => {
        const response = await APIClient.post(`/estimates/${estimateId}/send`, values, {
            headers: await AuthenticatedHeaders(),
        })
        return response.data
    },
    addMember: async (values: AddMemberInput) => {
        const response = await APIClient.post('/members', values, {
            headers: await AuthenticatedHeaders(),
        })
        return response.data
    },
    getMembers: async () => {
        const response = await APIClient.get('/members', {
            headers: await AuthenticatedHeaders(),
        })
        return response.data
    },   
    addCollaborator: async (values: AddCollaboratorInput) => {
        const response = await APIClient.post('/collaborators', values, {
            headers: await AuthenticatedHeaders(),
        })
        return response.data
    },    
  }
  