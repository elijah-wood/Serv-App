type UserResponse = {
  id: string
  first_name: string
  last_name?: string
  email?: string
  team?: Team
}
  
type Team = {
  twilio_phone_number: string
}

export type { UserResponse }
  