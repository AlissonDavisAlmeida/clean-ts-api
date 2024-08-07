import { DbAuthentication } from '../../../../@data/usecases/account/authentication/db-authentication';
import { BcryptAdapter, JWTAdapter } from '../../../../infra/criptography';
import { AccountMongoRepository, LogMongoRepository } from '@/infra/db/mongodb';
import { LogControllerDecorator } from '../../../decorators/log-controller.decorator';
import { LoginController } from '../../../../presentation/controller/account/login/loginController';
import { type Controller } from '../../../../presentation/protocols';
import { makeLoginValidatorFactory } from './login-validator-factory';
import { config } from '../../../config/env';

export const makeLoginController = (): Controller => {
  const { jwtSecret } = config;
  const accountMongoRepository = new AccountMongoRepository();
  const bcryptAdapter = new BcryptAdapter(12);
  const jwtAdapter = new JWTAdapter(jwtSecret);
  const dbAuthentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter);
  const validationComposite = makeLoginValidatorFactory();
  const loginController = new LoginController(dbAuthentication, validationComposite);
  const logMongoRepository = new LogMongoRepository();
  const logControllerDecorator = new LogControllerDecorator(loginController, logMongoRepository);
  return logControllerDecorator;
};
