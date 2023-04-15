import { UseMutationResult, useMutation } from 'react-query'
import { API } from './API'
import { TokenResponse } from './TokenResponse'

type CompleteSignInInput = {
    phone: string
    code: string
}

const UseCompleteSignIn = (): UseMutationResult<TokenResponse, Error, CompleteSignInInput> => {
    return useMutation<TokenResponse, Error, CompleteSignInInput>(values => {
        return API.completeLogin(values)
    })
}

export default UseCompleteSignIn
export type { CompleteSignInInput }
