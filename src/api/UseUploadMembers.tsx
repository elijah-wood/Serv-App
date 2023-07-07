import { UseMutationResult, useMutation } from 'react-query'
import { API } from './API'

export type UploadMemberContact = {
    phone?: string
    email?: string
    first_name?: string
    last_name?: string
}

type UploadMembersInput = UploadMemberContact[]

type UploadMembersResponse = {
    ok: boolean
}

const UseUploadMembers = (): UseMutationResult<UploadMembersResponse, Error, UploadMembersInput> => {
    return useMutation<UploadMembersResponse, Error, UploadMembersInput>(async values => {
        return API.uploadMembers(values);
    })
}

export default UseUploadMembers
export type { UploadMembersInput }