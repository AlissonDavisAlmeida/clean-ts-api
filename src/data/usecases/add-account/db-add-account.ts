import {
  type AccountModel,
  type AddAccountModel,
  type AddAccount,
  type Encrypter
} from './db-add-account-protocols';

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
