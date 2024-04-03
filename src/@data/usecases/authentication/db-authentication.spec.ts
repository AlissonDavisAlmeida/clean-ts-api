import { type LoadAccountByEmailRepository } from '@/@data/protocols/db/loadAccountByEmail.repository';
import { type AccountModel } from '@/@data/usecases/add-account/db-add-account-protocols';
import { type AuthenticationParams } from '@/@domain/useCases/authentication';
import { DbAuthentication } from './db-authentication';
import { type HashComparer, type HashComparerParams } from '@/@data/protocols/criptography/hashComparer';

const CONSTANTS = {
  LoadAccountByEmailRepositoryStub: 'LoadAccountByEmailRepositoryStub',
  HashComparer: 'HashComparer'
};

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashCompareStub: HashComparer
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

function makeSut (): SutTypes {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const hashCompareStub = makeHashComparer();
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashCompareStub);

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashCompareStub
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
});
