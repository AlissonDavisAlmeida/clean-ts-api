export interface UpdateAccessTokenRepositoryParams {
  accessToken: string
  id: string

}

export interface UpdateAccessTokenRepository {
  updateAccessToken: ({ accessToken, id }: UpdateAccessTokenRepositoryParams) => Promise<void>
}
