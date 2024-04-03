import { type LoadAccountByEmailRepository, type HashComparer, type TokenGenerator, type UpdateAccessTokenRepository } from './db-authentication-protocols';
import { type AuthenticationParams, type Authentication } from '@/@domain/useCases/authentication';

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) { }

  async auth (authenticationParams: AuthenticationParams): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authenticationParams.email);

    if (!account) {
      return null;
    }

    const isValidPassword = await this.hashComparer.compare({
      password: authenticationParams.password,
      hashedPassword: account.password
    });

    if (!isValidPassword) {
      return null;
    }

    const token = await this.tokenGenerator.generate(account.id);

    await this.updateAccessTokenRepository.updateAccessToken({
      id: account.id,
      accessToken: token
    });

    return token;
  }
}
