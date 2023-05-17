import { UseMutationResult, useMutation } from 'react-query'
import { API } from './API'

type AddMemberInput = {
    phone: string
}

type AddMemberResponse = {
    ok: boolean
}

const UseAddMember = (): UseMutationResult<AddMemberResponse, Error, AddMemberInput> => {
    return useMutation<AddMemberResponse, Error, AddMemberInput>(async values => {
        return API.addMember(values)
    })
}

export default UseAddMember
export type { AddMemberInput }