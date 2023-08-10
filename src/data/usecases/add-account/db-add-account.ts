import { type AccountModel } from '../../../domain/models/AccountModel';
import { type AddAccount, type AddAccountModel } from '../../../domain/useCases/addAccount';
import { type Encrypter } from '../../protocols/encrypter';

export class DbAddAccount implements AddAccount {
  constructor (private readonly encrypter: Encrypter) { }

  async add (account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(account.password);
    return await new Promise(resolve => {
      resolve({
        id: 'valid_id',
        name: 'valid_name',
        email: '',
        password: hashedPassword
      });
    });
  };
}
