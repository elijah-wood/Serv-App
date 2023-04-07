import APIClient from "./APIClient"
import { AuthenticatedHeaders } from "./AuthenticatedHeaders"
import { getUserSession } from "./Session"
import { CompleteSignInInput } from "./UseCompleteSignIn"
import { CreateCustomerInput } from "./UseCreateCustomer"
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
        const session = await getUserSession()
        const response = await APIClient.post('/refresh-token', {
          token: session?.user.jwt, // the parameter would be the refresh token
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
        return response.status
    },
    getJobs: async () => {
        const response = await APIClient.get('/jobs', {
            headers: await AuthenticatedHeaders(),
        })
        return response.data
    },
    generateTwilioAccessToken: async () => {
        const response = await APIClient.post('/generate-twilio-access-token', [], {
            headers: await AuthenticatedHeaders(),
        })
        return response.data
    },
  }
  