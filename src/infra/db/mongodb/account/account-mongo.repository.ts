import {
  type LoadAccountByEmailRepository,
  type AddAccountRepository,
  type UpdateAccessTokenRepository,
  type UpdateAccessTokenRepositoryParams
} from '@/@data/protocols/db/account';
import { type AccountModel } from '../../../../@domain/models/AccountModel';
import { type AddAccountModel } from '../../../../@domain/useCases/addAccount';
import { mongoHelper } from '../helpers/mongo-helper';
import { AccountAlreadyExistsError } from '@/presentation/errors';

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await mongoHelper.getCollection('accounts');
    const accountExists = await accountCollection?.findOne({ email: accountData.email });

    if (accountExists) {
      throw new AccountAlreadyExistsError();
    }

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

  async updateAccessToken ({ accessToken, id }: UpdateAccessTokenRepositoryParams): Promise<void> {
    const accountCollection = await mongoHelper.getCollection('accounts');
    await accountCollection?.updateOne({
      _id: id
    }, {
      $set: {
        accessToken
      }
    });
  }
}
