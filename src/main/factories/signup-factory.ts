import { DbAddAccount } from '../../data/usecases/add-account/db-add-account';
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter';
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account';
import { SignupController } from '../../presentation/controller/signup/SignupController';
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter';

export const makeSignupController = (): SignupController => {
  const salt = 12;
  const emailValidatorAdapter = new EmailValidatorAdapter();
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);
  const signupController = new SignupController(emailValidatorAdapter, dbAddAccount);

  return signupController;
};
