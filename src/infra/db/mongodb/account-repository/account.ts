import { type LoadAccountByEmailRepository } from '@/@data/protocols/db/loadAccountByEmail.repository';
import { type AddAccountRepository } from '../../../../@data/protocols/db/addAccountRepository';
import { type AccountModel } from '../../../../@domain/models/AccountModel';
import { type AddAccountModel } from '../../../../@domain/useCases/addAccount';
import { mongoHelper } from '../helpers/mongo-helper';

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await mongoHelper.getCollection('accounts');
    const result = await accountCollection?.insertOne(accountData);

    if (!result?.acknowledged) {
      throw new Error('Error on insert new account');
    }

    const account = await accountCollection?.findOne({ _id: result.insertedId });

    if (!account) {
      throw new Error('Error on find inserted account');
    }

    return mongoHelper.map<AccountModel>(account);
  }

  async loadByEmail (email: string): Promise<AccountModel | null> {
    const accountCollection = await mongoHelper.getCollection('accounts');
    const account = await accountCollection?.findOne({ email });

    if (!account) {
      return null;
    }
    return mongoHelper.map<AccountModel>(account);
  }
}
