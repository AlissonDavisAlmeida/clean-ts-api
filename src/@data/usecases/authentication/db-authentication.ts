import { type HashComparer } from '@/@data/protocols/criptography/hashComparer';
import { type TokenGenerator } from '@/@data/protocols/criptography/tokenGenerator';
import { type LoadAccountByEmailRepository } from '@/@data/protocols/db/loadAccountByEmail.repository';
import { type AuthenticationParams, type Authentication } from '@/@domain/useCases/authentication';

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator
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

    await this.tokenGenerator.generate(account.id);

    return 'any_token';
  }
}
