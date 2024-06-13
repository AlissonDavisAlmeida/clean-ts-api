import { DbAuthentication } from '@/@data/usecases/authentication/db-authentication';
import { DbAddAccount } from '../../../@data/usecases/add-account/db-add-account';
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter';
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo.repository';
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo.repository';
import { SignupController } from '../../../presentation/controller/signup/SignupController';
import { type Controller } from '../../../presentation/protocols';
import { LogControllerDecorator } from '../../decorators/log-controller.decorator';
import { makeSignupValidatorFactory } from './signup-validator-factory';
import { JWTAdapter } from '@/infra/criptography';
import { config } from '@/main/config/env';

export const makeSignupController = (): Controller => {
  const salt = 12;
  const { jwtSecret } = config;
  const bcryptAdapter = new BcryptAdapter(salt);
  const jwtAdapter = new JWTAdapter(jwtSecret);
  const accountMongoRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);
  const validationComposite = makeSignupValidatorFactory();
  const authentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter);
  const signupController = new SignupController(dbAddAccount, validationComposite, authentication);
  const logMongoRepository = new LogMongoRepository();
  const logControllerDecorator = new LogControllerDecorator(signupController, logMongoRepository);
  return logControllerDecorator;
};
