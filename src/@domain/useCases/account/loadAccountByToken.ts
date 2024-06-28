export type LoadAccountByTokenResponse = {
  account_id: string

}

export interface LoadAccountByToken {
  load: (accessToken: string, role?: string) => Promise<LoadAccountByTokenResponse | null>
}
