import { UseMutationResult, useMutation } from 'react-query'
import { API } from './API'
import { SCResponse } from './SCResponse'

type SignInInput = {
  phone: string
}

const UseSignIn = (): UseMutationResult<SCResponse, Error, SignInInput> => {
    return useMutation<SCResponse, Error, SignInInput>(values=> {
        return API.login(values)
    })
}

export default UseSignIn
export type { SignInInput }
