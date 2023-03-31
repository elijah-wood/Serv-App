import jwtDecode from 'jwt-decode'
import { SignInInput } from './UseSignIn'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

class APIClient {
  private baseUrl = 'https://bloodhound.servcommerce.com/api'
  private authToken = null

  public async post<D, R> (path: string, data: D) {
    const response = await fetch(`${this.baseUrl}/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data })
    })

    if (response.ok) {
      const jsonResponse: ApiResponse<R> = await response.json()
      return jsonResponse.data
    } else {
      throw new Error(`${response.status}`)
    }
  }

  public async getWithToken<T>(path: string) {
    const authToken = await this.getAuthToken()
    const response = await fetch(`${this.baseUrl}${path}`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    })

    const apiResponse: ApiResponse<T> = await response.json()
    if (response.ok) {
      return apiResponse.data
    } else {
      throw new Error(apiResponse.error)
    }
  }

  private async getAuthToken() {
    if (!this.authToken) {
      // this.authToken = await AsyncStorage.getItem('authToken')
      if (!this.authToken) {
        throw new Error('Not authenticated')
      }
    }

    const decodedToken: { exp: number } = jwtDecode(this.authToken)
    if (decodedToken.exp < Date.now() / 1000) {
      throw new Error('Token expired')
    }

    return this.authToken
  }
}

export default APIClient
