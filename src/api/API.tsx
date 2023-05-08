import APIClient from "./APIClient"
import { AuthenticatedHeaders } from "./AuthenticatedHeaders"
import { getUserSession } from "./Session"
import { CompleteSignInInput } from "./UseCompleteSignIn"
import { CreateCustomerInput } from "./UseCreateCustomer"
import { CreateInvoiceInput } from "./UseCreateInvoice"
import { CreateJobInput } from "./UseCreateJob"
import { SignInInput } from "./UseSignIn"

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
  }
  