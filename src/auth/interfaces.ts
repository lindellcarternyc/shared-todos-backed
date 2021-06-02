export interface AuthToken {
  authToken: string
  refreshToken: string
}

export interface AuthResponse {
  id: number
  token: AuthToken
}