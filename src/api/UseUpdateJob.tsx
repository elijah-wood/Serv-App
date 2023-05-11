import { UseMutationResult, useMutation } from 'react-query'
import { API } from './API'

type UpdateJobInput = {
    status: string
}

type CreateJobResponse = {
    ok: boolean
}

const UseUpdateJob = (jobId: string): UseMutationResult<CreateJobResponse, Error, UpdateJobInput> => {
    return useMutation<CreateJobResponse, Error, UpdateJobInput>(async values => {
        return API.updateJob(jobId, values)
    })
}

export { UpdateJobInput }
export default UseUpdateJob