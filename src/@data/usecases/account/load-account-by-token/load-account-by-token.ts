import { type LoadAccountByToken } from '@/@domain/useCases/account/loadAccountByToken';
import { type AccountModel } from '../add-account/db-add-account-protocols';
import { type Decrypter } from '@/@data/protocols/criptography/decrypter';

export class LoadAccountByTokenUseCase implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter

  ) {}

  load = async (accessToken: string, role?: string): Promise<AccountModel | null> => {
    const payload = await this.decrypter.decrypt(accessToken);
    return null;
  };
}
