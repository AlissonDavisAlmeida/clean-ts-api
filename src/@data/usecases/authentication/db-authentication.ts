import { type LoadAccountByEmailRepository } from '@/@data/protocols/db/loadAccountByEmail.repository';
import { type AuthenticationParams, type Authentication } from '@/@domain/useCases/authentication';

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) { }

  async auth (authenticationParams: AuthenticationParams): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authenticationParams.email);
    return new Promise(resolve => { resolve('any_token'); });
  }
}
