import jwtDecode from 'jwt-decode'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

class ApiClient {
  private baseUrl = 'https://api.servcommerce.com'
  private authToken = null

  public async signin(phone: string) {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phone })
    })

    if (response.ok) {
      const { token } = await response.json()
      this.authToken = token
    //   await AsyncStorage.setItem('authToken', token)
    } else {
      throw new Error('Login failed')
    }
  }

  public async logout() {
    this.authToken = null
    // await AsyncStorage.removeItem('authToken')
  }

  public async get<T>(path: string) {
    const authToken = await this.getAuthToken()
    const response = await fetch(`${this.baseUrl}${path}`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    })

    const apiResponse: ApiResponse<T> = await response.json()
    if (apiResponse.success) {
      return apiResponse.data!
    } else {
      throw new Error(apiResponse.error)
    }
  }

  public async getCustomers() {
    const response = await this.get<any[]>('/customers')
    return response
  }

  private async getAuthToken() {
    if (!this.authToken) {
    //   this.authToken = await AsyncStorage.getItem('authToken')
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

export default ApiClient
