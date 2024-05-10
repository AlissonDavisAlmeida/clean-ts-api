export interface UpdateAccessTokenRepositoryParams {
  accessToken: string
  id: any

}

export interface UpdateAccessTokenRepository {
  updateAccessToken: ({ accessToken, id }: UpdateAccessTokenRepositoryParams) => Promise<void>
}
