import * as SecureStore from 'expo-secure-store'

import { UserResponse } from './UserResponse'

type Session = {
  user: UserResponse
}

const setUserSession = async (user: UserResponse): Promise<void> => {
  try {
    await SecureStore.setItemAsync(
      'user_session',
      JSON.stringify({
        user,
      }),
    )
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
  }
}

const getUserSession = async (): Promise<Session | undefined> => {
  try {
    const session = await SecureStore.getItemAsync('user_session')

    if (session) {
      return JSON.parse(session)
    } else {
      return undefined
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    return undefined
  }
}

const removeUserSession = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync('user_session')
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
  }
}

export { setUserSession, getUserSession, removeUserSession }
export type { Session }
