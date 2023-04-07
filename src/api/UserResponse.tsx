type UserResponse = {
    jwt: string
    id: number
    first_name: string
    last_name?: string
    email?: string
    twilio_token: string
  }
  
  export type { UserResponse }
  