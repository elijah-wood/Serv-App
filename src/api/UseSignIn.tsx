import { UseMutationResult, useMutation } from 'react-query'

import { API } from './API'
import { UserResponse } from './UserResponse'

type SignInInput = {
  phone: string
}

const UseSignIn = (): UseMutationResult<UserResponse, Error, SignInInput> => {
  return useMutation<UserResponse, Error, SignInInput>(async values => {
    return API.login(values)
  })
}

export default UseSignIn
export type { SignInInput }
