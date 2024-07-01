import { type LoadAccountByToken } from '@/@domain/useCases/account/loadAccountByToken';
import { LoadAccountByTokenUseCase } from './load-account-by-token';
import { type Decrypter } from '@/@data/protocols/criptography/decrypter';
import { type LoadAccountByTokenRepository } from '@/@data/protocols/db/account/loadAccountByToken.repository';
import { type AccountModel } from '../add-account/db-add-account-protocols';

type SutTypes = {
  sut: LoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const makeFakeAccount = () => ({
  id: 'valid_id',
  name: 'any_name',
  email: 'valid@mail.com',
  password: 'any_password'
});

const makeLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    loadByToken = async (token: string, role?: string): Promise<AccountModel | null> => {
      return makeFakeAccount();
    };
  }

  return new LoadAccountByTokenRepositoryStub();
};

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    decrypt = async (value: string): Promise<string> => {
      return 'any_value';
    };
  }

  return new DecrypterStub();
};

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter();
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepository();
  const loadAccountByToken = new LoadAccountByTokenUseCase(decrypterStub, loadAccountByTokenRepositoryStub);

  return {
    sut: loadAccountByToken,
    decrypterStub,
    loadAccountByTokenRepositoryStub
  };
};

describe('LoadAccountByToken Usecase', () => {
  test('should call decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut();

    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt');

    await sut.load('any_token', 'any_role');

    expect(decryptSpy).toHaveBeenCalledWith('any_token');
  });

  test('should return null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut();

    jest.spyOn(decrypterStub, 'decrypt').mockResolvedValue(null);

    const account = await sut.load('any_token');

    expect(account).toBeNull();
  });

  test('should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();

    const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken');

    await sut.load('any_token', 'any_role');

    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', 'any_role');
  });
});
