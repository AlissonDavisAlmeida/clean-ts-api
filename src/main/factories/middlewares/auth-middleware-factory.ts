import { LoadAccountByTokenUseCase } from '@/@data/usecases/account/load-account-by-token/load-account-by-token';
import { JWTAdapter } from '@/infra/criptography';
import { AccountMongoRepository } from '@/infra/db/mongodb';
import { config } from '@/main/config/env';
import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware';
import { type Middleware } from '@/presentation/protocols/middlewares';

const makeLoadAccountByTokenUseCase = (): LoadAccountByTokenUseCase => {
  const { jwtSecret } = config;
  const decrypter = new JWTAdapter(jwtSecret);
  const loadAccountByTokenRepository = new AccountMongoRepository();
  const loadAccountByTokenUseCase = new LoadAccountByTokenUseCase(decrypter, loadAccountByTokenRepository);
  return loadAccountByTokenUseCase;
};

export const makeAuthMiddleware = (role?: string): Middleware => {
  const loadAccountByTokenUseCase = makeLoadAccountByTokenUseCase();
  return new AuthMiddleware(loadAccountByTokenUseCase, role);
};
