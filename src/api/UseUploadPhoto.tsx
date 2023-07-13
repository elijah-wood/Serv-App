import { UseMutationResult, useMutation } from 'react-query'
import { API } from './API'

export type UploadPhotoInput = {
    images: Blob[]
}

type UploadMembersResponse = {
    ok: boolean
}

const UseUploadPhoto = (jobId: string): UseMutationResult<UploadMembersResponse, Error, UploadPhotoInput> => {
    return useMutation<UploadMembersResponse, Error, UploadPhotoInput>(async values => {
        return API.uploadPhoto(jobId, values)
    })
}

export default UseUploadPhoto
