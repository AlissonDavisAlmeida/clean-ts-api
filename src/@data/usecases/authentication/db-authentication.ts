import { type HashComparer } from '@/@data/protocols/criptography/hashComparer';
import { type LoadAccountByEmailRepository } from '@/@data/protocols/db/loadAccountByEmail.repository';
import { type AuthenticationParams, type Authentication } from '@/@domain/useCases/authentication';

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer
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

    return 'any_token';
  }
}
