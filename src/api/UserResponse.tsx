type UserResponse = {
  id: string
  first_name: string
  last_name?: string
  email?: string
  team?: Team
  phone?: string
}
  
type Team = {
  twilio_phone_number: string
  name: string
}

export type { UserResponse }
  