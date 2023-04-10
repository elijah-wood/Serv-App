import { UseMutationResult, useMutation } from 'react-query'
import { API } from './API'
import { UserResponse } from './UserResponse'

type CompleteSignInInput = {
    phone: string
    verification_code: string
}

const UseCompleteSignIn = (): UseMutationResult<UserResponse, Error, CompleteSignInInput> => {
    return useMutation<UserResponse, Error, CompleteSignInInput>(values => {
        console.log(values)
        return API.completeLogin(values)
    })
}

export default UseCompleteSignIn
export type { CompleteSignInInput }
