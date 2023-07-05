import { UseMutationResult, useMutation } from 'react-query'
import { API } from './API'
import { Member } from './UseCustomers'

type UploadMembersInput = Member[]

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