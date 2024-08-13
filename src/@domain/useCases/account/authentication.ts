export interface AuthenticationParams {
  email: string
  password: string

}

export type AuthenticationResult = {
  token: string
  name: string
}

export interface Authentication {
  auth: (params: AuthenticationParams) => Promise<AuthenticationResult | null>
}
