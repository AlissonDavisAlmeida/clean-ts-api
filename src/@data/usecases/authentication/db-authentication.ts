import { type LoadAccountByEmailRepository, type HashComparer, type Encrypter, type UpdateAccessTokenRepository } from './db-authentication-protocols';
import { type AuthenticationParams, type Authentication } from '@/@domain/useCases/authentication';

export class DbAuthentication implements Authentication {
  constructor (
    private readonly accountRepository: LoadAccountByEmailRepository & UpdateAccessTokenRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter
  ) { }

  async auth (authenticationParams: AuthenticationParams): Promise<string | null> {
    const account = await this.accountRepository.loadByEmail(authenticationParams.email);

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

    const token = await this.encrypter.generate(account.id);

    await this.accountRepository.updateAccessToken({
      id: account.id,
      accessToken: token
    });

    return token;
  }
}
