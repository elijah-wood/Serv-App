import { useQuery, UseQueryResult } from 'react-query'
import { API } from './API'
import { Member } from './UseCustomers'

type UseMembersResult = {
    ok: boolean
    result: Member[]
}

const UseMembers = (): UseQueryResult<UseMembersResult, Error> => {
    return useQuery<UseMembersResult, Error>('Members', async () => {
        return API.getMembers()
    }, { retry: 0 })
}

export default UseMembers
export type { UseMembersResult }