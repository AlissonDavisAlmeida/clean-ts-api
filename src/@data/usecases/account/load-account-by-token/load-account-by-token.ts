import { type LoadAccountByToken } from '@/@domain/useCases/account/loadAccountByToken';
import { type AccountModel } from '../add-account/db-add-account-protocols';
import { type Decrypter } from '@/@data/protocols/criptography/decrypter';
import { type LoadAccountByTokenRepository } from '@/@data/protocols/db/account/loadAccountByToken.repository';

export class LoadAccountByTokenUseCase implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) { }

  load = async (accessToken: string, role?: string): Promise<AccountModel | null> => {
    const token = await this.decrypter.decrypt(accessToken);

    if (token) {
      const account = this.loadAccountByTokenRepository.loadByToken(accessToken, role);

      if (account) {
        return account;
      }
    }

    return null;
  };
}
