import { UseMutationResult, useMutation } from 'react-query'
import { API } from './API'
import { UserResponse } from './UserResponse'

type CompleteSignInInput = {
    verification_token: string
}

const UseCompleteSignIn = (): UseMutationResult<UserResponse, Error, CompleteSignInInput> => {
    return useMutation<UserResponse, Error, CompleteSignInInput>(values => {
        return API.completeLogin(values)
    })
}

export default UseCompleteSignIn
export type { CompleteSignInInput }
