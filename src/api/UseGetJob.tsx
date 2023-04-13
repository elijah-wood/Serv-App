import { useQuery, UseQueryResult } from 'react-query'
import { API } from './API'
import { Job } from './UseJobs'

const UseGetJob = (jobId: string): UseQueryResult<Job, Error> => {
    return useQuery<Job, Error>('Job', async () => {
        return API.getJob(jobId)
    })
}

export default UseGetJob
