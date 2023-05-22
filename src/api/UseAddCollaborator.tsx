import { UseMutationResult, useMutation } from 'react-query'
import { API } from './API'

type AddCollaboratorInput = {
    member_id: string
    customer_id: string
}

type AddCollaboratorResponse = {
    ok: boolean
}

const UseAddCollaborator = (): UseMutationResult<AddCollaboratorResponse, Error, AddCollaboratorInput> => {
    return useMutation<AddCollaboratorResponse, Error, AddCollaboratorInput>(async values => {
        return API.addCollaborator(values)
    })
}

export default UseAddCollaborator
export type { AddCollaboratorInput }