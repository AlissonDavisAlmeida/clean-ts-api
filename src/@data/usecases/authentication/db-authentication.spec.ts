import { type LoadAccountByEmailRepository } from '@/@data/protocols/db/loadAccountByEmail.repository';
import { type AccountModel } from '@/@data/usecases/add-account/db-add-account-protocols';
import { type AuthenticationParams } from '@/@domain/useCases/authentication';
import { DbAuthentication } from './db-authentication';
import { type HashComparer, type HashComparerParams } from '@/@data/protocols/criptography/hashComparer';
import { type TokenGenerator } from '@/@data/protocols/criptography/tokenGenerator';
import { type UpdateAccessTokenRepository, type UpdateAccessTokenRepositoryParams } from '@/@data/protocols/db/update-accessToken-repository';

const CONSTANTS = {
  LoadAccountByEmailRepositoryStub: 'LoadAccountByEmailRepositoryStub',
  HashComparer: 'HashComparer',
  TokenGenerator: 'TokenGenerator',
  UpdateAccessTokenRepository: 'UpdateAccessTokenRepository'
};

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashCompareStub: HashComparer
  tokenGeneratorStub: TokenGenerator
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

function makeTokenGenerator (): TokenGenerator {
  class TokenGeneratorStub implements TokenGenerator {
    async generate (id: string) {
      return 'any_token';
    }
  }

  return new TokenGeneratorStub();
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
  const tokenGeneratorStub = makeTokenGenerator();
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
  );

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    tokenGeneratorStub,
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

    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(null);

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

  test(`should call ${CONSTANTS.TokenGenerator} with correct id`, async () => {
    const { sut, tokenGeneratorStub } = makeSut();

    const generateTokenSpy = jest.spyOn(tokenGeneratorStub, 'generate');
    await sut.auth(makeFakeAuthenticationParams());

    expect(generateTokenSpy).toHaveBeenCalledWith(makeFakeAccount().id);
  });

  test(`should throws an error if ${CONSTANTS.TokenGenerator} throw an error`, async () => {
    const { sut, tokenGeneratorStub } = makeSut();

    jest.spyOn(tokenGeneratorStub, 'generate').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()); }));
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
