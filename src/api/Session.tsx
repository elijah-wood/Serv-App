import AsyncStorage from '@react-native-async-storage/async-storage';

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

const removeUserSession = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('user_session')
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
  }
}

export { setUserSession, getUserSession, removeUserSession }
export type { Session }
