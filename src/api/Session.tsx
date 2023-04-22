import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from "jwt-decode"
import { UserResponse } from './UserResponse';

type Session = {
  token: string
}

const setUserSession = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      'user_session',
      JSON.stringify({
        token: token,
      }),
    )
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
  }
}

const getUserSession = async (): Promise<Session | undefined> => {
  try {
    const session = await AsyncStorage.getItem('user_session')

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

const getUserFromToken = async (): Promise<UserResponse | undefined> => {
  try {
    const session = await AsyncStorage.getItem('user_session')
    if (session) {
      let token = JSON.parse(session).token as string
      let user = jwt_decode(token) as UserResponse
      return user
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    return undefined
  }
}

const removeUserSession = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('user_session')
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
  }
}

export { setUserSession, getUserSession, removeUserSession, getUserFromToken }
export type { Session }

