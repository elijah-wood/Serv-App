import { useQuery, UseQueryResult } from 'react-query'
import { API } from './API'
import { Job } from './UseJobs'

type UseGetJobResponse = {
    ok: boolean
    result: Job
}

const UseGetJob = (jobId: string): UseQueryResult<UseGetJobResponse, Error> => {
    return useQuery<UseGetJobResponse, Error>('Job', async () => {
        return API.getJob(jobId)
    })
}

export default UseGetJob
