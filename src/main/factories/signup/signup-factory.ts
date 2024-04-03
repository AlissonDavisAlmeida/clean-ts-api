import { DbAddAccount } from '../../../@data/usecases/add-account/db-add-account';
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter';
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account';
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log-repository';
import { SignupController } from '../../../presentation/controller/signup/SignupController';
import { type Controller } from '../../../presentation/protocols';
import { LogControllerDecorator } from '../../decorators/log';
import { makeSignupValidatorFactory } from './signup-validator-factory';

export const makeSignupController = (): Controller => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);
  const validationComposite = makeSignupValidatorFactory();
  const signupController = new SignupController(dbAddAccount, validationComposite);
  const logMongoRepository = new LogMongoRepository();
  const logControllerDecorator = new LogControllerDecorator(signupController, logMongoRepository);
  return logControllerDecorator;
};
