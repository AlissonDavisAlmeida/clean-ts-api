import { type AccountModel } from '@/@domain/models/AccountModel';
import { type AddAccountModel } from '@/@domain/useCases/account/addAccount';

export interface AddAccountRepository {
  add: (accountData: AddAccountModel) => Promise<AccountModel>
}
