import { Customer } from "../types/Customer"
import APIClient from "./APIClient"
import { SCResponse } from "./SCResponse"
import { CompleteSignInInput } from "./UseCompleteSignIn"
import { UserResponse } from "./UserResponse"
import { SignInInput } from "./UseSignIn"

let client = new APIClient()

export const API = {
    login: async (values: SignInInput) => {
        return await client.post<SignInInput, SCResponse>('/login', values)
    },
    completeLogin: async (values: CompleteSignInInput) => {
        return await client.post<CompleteSignInInput, UserResponse>('/complete-login', values)
    },
    getCustomers: async () => {
        return await client.getWithToken<Customer[]>('/customers')
    },
  }
  