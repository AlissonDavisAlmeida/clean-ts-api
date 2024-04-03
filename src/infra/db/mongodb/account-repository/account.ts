import { type AddAccountRepository } from '../../../../@data/protocols/db/addAccountRepository';
import { type AccountModel } from '../../../../@domain/models/AccountModel';
import { type AddAccountModel } from '../../../../@domain/useCases/addAccount';
import { mongoHelper } from '../helpers/mongo-helper';

export class AccountMongoRepository implements AddAccountRepository {
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
}
