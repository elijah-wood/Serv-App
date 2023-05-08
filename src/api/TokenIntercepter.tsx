import createAuthRefreshInterceptor from 'axios-auth-refresh'
import { InternalAxiosRequestConfig } from 'axios'

import APIClient from './APIClient'
import { getUserSession, setUserSession } from './Session'
import { errorResponseHandler } from './ErrorHandler'
import { API } from './API'

const addRequestInterceptor = (): void => {
  APIClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const session = await getUserSession()
      if (session && config.headers) {
        config.headers.Authorization = `Bearer ${session?.token}`
      }
      return config
    },
    error => {
      return Promise.reject(error)
    },
  )
}

const addResponseInterceptor = (): void => {
  APIClient.interceptors.response.use(response => response, errorResponseHandler)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const refreshTokenCall = async (failedRequest: any) => {
  const data = await API.refreshToken()
  data && await setUserSession(data.token)
  failedRequest.response.config.headers.Authorization = 'Bearer ' + data.token
  return Promise.resolve()
}

const addRefreshTokenInterceptor = (): void => {
  // Instantiate the interceptor (you can chain it as it returns the axios instance)
  createAuthRefreshInterceptor(APIClient, refreshTokenCall, { statusCodes: [500, 401]})
}

export default { addRequestInterceptor, addRefreshTokenInterceptor, addResponseInterceptor }
