import { type LoadAccountByEmailRepository } from '@/@data/protocols/db/loadAccountByEmail.repository';
import { type AccountModel } from '@/@data/usecases/add-account/db-add-account-protocols';
import { type AuthenticationParams } from '@/@domain/useCases/authentication';
import { DbAuthentication } from './db-authentication';

const CONSTANTS = {
  LoadAccountByEmailRepositoryStub: 'LoadAccountByEmailRepositoryStub'
};

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository

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

class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
  async loadByEmail (email: string): Promise<AccountModel> {
    return new Promise(resolve => { resolve(makeFakeAccount()); });
  }
}

function makeSut (): SutTypes {
  const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub();
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub);

  return {
    sut,
    loadAccountByEmailRepositoryStub
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
});
