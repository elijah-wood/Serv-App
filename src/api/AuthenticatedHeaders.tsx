import { getUserSession } from '../api/Session'

export const AuthenticatedHeaders = async (): Promise<{ Authorization: string }> => {
  const session = await getUserSession()
  return { Authorization: `Bearer ${session?.token}` }
}