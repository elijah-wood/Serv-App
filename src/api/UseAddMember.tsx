import { UseMutationResult, useMutation } from 'react-query'
import { API } from './API'
import { Member } from './UseCustomers'

type AddMemberInput = {
    phone: string
}

type AddMemberResponse = {
    ok: boolean
    result?: Member[]
}

const UseAddMember = (): UseMutationResult<AddMemberResponse, Error, AddMemberInput> => {
    return useMutation<AddMemberResponse, Error, AddMemberInput>(async values => {
        return API.addMember(values)
    })
}

export default UseAddMember
export type { AddMemberInput }