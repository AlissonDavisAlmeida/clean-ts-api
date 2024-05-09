import {
  type HashComparer,
  type HashComparerParams,
  type LoadAccountByEmailRepository,
  type Encrypter,
  type UpdateAccessTokenRepository,
  type UpdateAccessTokenRepositoryParams
} from './db-authentication-protocols';
import { type AccountModel } from '@/@data/usecases/add-account/db-add-account-protocols';
import { type AuthenticationParams } from '@/@domain/useCases/authentication';
import { DbAuthentication } from './db-authentication';

const CONSTANTS = {
  LoadAccountByEmailRepositoryStub: 'LoadAccountByEmailRepositoryStub',
  HashComparer: 'HashComparer',
  Encrypter: 'Encrypter',
  UpdateAccessTokenRepository: 'UpdateAccessTokenRepository'
};

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashCompareStub: HashComparer
  encrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeFakeAuthenticationParams = (): AuthenticationParams => ({
  email: 'mail@mail.com',
  password: 'password'
});

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'mail@mail.com',
  password: 'hashed_password'
});

function makeLoadAccountByEmailRepository (): LoadAccountByEmailRepository {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      return new Promise(resolve => { resolve(makeFakeAccount()); });
    }
  }

  return new LoadAccountByEmailRepositoryStub();
}

function makeHashComparer (): HashComparer {
  class HashComparerStub implements HashComparer {
    async compare (data: HashComparerParams): Promise<boolean> {
      return new Promise(resolve => { resolve(true); });
    }
  }

  return new HashComparerStub();
}

function makeEncrypter (): Encrypter {
  class EncrypterStub implements Encrypter {
    async generate (id: string) {
      return 'any_token';
    }
  }

  return new EncrypterStub();
}

function makeUpdateAccessTokenRepository (): UpdateAccessTokenRepository {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (data: UpdateAccessTokenRepositoryParams): Promise<void> {
      return new Promise(resolve => { resolve(); });
    }
  }

  return new UpdateAccessTokenRepositoryStub();
}

function makeSut (): SutTypes {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const hashCompareStub = makeHashComparer();
  const encrypterStub = makeEncrypter();
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  );

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  };
}

describe('DbAuthentication UseCase', () => {
  test(`should call ${CONSTANTS.LoadAccountByEmailRepositoryStub} with correct email`, async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail');

    await sut.auth(makeFakeAuthenticationParams());

    expect(loadSpy).toHaveBeenCalledWith(makeFakeAuthenticationParams().email);
  });
  test(`should throw an error if ${CONSTANTS.LoadAccountByEmailRepositoryStub} throws`, async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()); }));

    const promise = sut.auth(makeFakeAuthenticationParams());

    await expect(promise).rejects.toThrow();
  });

  test(`should return null if ${CONSTANTS.LoadAccountByEmailRepositoryStub} returns null`, async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve(null));

    const accessToken = await sut.auth(makeFakeAuthenticationParams());

    expect(accessToken).toBeNull();
  });

  test(`should call ${CONSTANTS.HashComparer} with correct values`, async () => {
    const { sut, hashCompareStub } = makeSut();

    const compareSpy = jest.spyOn(hashCompareStub, 'compare');
    await sut.auth(makeFakeAuthenticationParams());

    expect(compareSpy).toHaveBeenCalledWith({
      password: makeFakeAuthenticationParams().password,
      hashedPassword: makeFakeAccount().password
    });
  });
  test(`should throws an error if ${CONSTANTS.HashComparer} throw an error`, async () => {
    const { sut, hashCompareStub } = makeSut();

    jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()); }));
    const promise = sut.auth(makeFakeAuthenticationParams());

    await expect(promise).rejects.toThrow();
  });

  test(`should return null if ${CONSTANTS.HashComparer} returns false`, async () => {
    const { sut, hashCompareStub } = makeSut();

    jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(new Promise(resolve => { resolve(false); }));

    const accessToken = await sut.auth(makeFakeAuthenticationParams());

    expect(accessToken).toBeNull();
  });

  test(`should call ${CONSTANTS.Encrypter} with correct id`, async () => {
    const { sut, encrypterStub } = makeSut();

    const generateTokenSpy = jest.spyOn(encrypterStub, 'generate');
    await sut.auth(makeFakeAuthenticationParams());

    expect(generateTokenSpy).toHaveBeenCalledWith(makeFakeAccount().id);
  });

  test(`should throws an error if ${CONSTANTS.Encrypter} throw an error`, async () => {
    const { sut, encrypterStub } = makeSut();

    jest.spyOn(encrypterStub, 'generate').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()); }));
    const promise = sut.auth(makeFakeAuthenticationParams());

    await expect(promise).rejects.toThrow();
  });

  test('should return a token on success', async () => {
    const { sut } = makeSut();

    const accessToken = await sut.auth(makeFakeAuthenticationParams());

    expect(accessToken).toBe('any_token');
  });

  test(`should call ${CONSTANTS.UpdateAccessTokenRepository} with correct values`, async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken');

    await sut.auth(makeFakeAuthenticationParams());

    expect(updateSpy).toHaveBeenCalledWith({
      id: makeFakeAccount().id,
      accessToken: 'any_token'
    });
  });

  test(`should throws an error if ${CONSTANTS.UpdateAccessTokenRepository} throw an error`, async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();

    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()); }));
    const promise = sut.auth(makeFakeAuthenticationParams());

    await expect(promise).rejects.toThrow();
  });
});
