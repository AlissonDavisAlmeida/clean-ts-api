import { type Hasher } from '../../../protocols/criptography/hasher';
import { DbAddAccount } from './db-add-account';
import { type AddAccountRepository, type AccountModel, type AddAccountModel } from './db-add-account-protocols';

interface MakeSutTypes {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
}

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await new Promise(resolve => { resolve('hashed_password'); });
    }
  }

  return new HasherStub();
};
const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@gmail.com',
        password: 'hashed_password'
      };
      return await new Promise(resolve => {
        resolve(fakeAccount);
      });
    }
  }

  return new AddAccountRepositoryStub();
};

const makeSut = (): MakeSutTypes => {
  const hasherStub = makeHasher();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub);

  return { sut, hasherStub, addAccountRepositoryStub };
};

describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { hasherStub, sut } = makeSut();
    const hasherSpy = jest.spyOn(hasherStub, 'hash');
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@gmail.com',
      password: 'valid_password'
    };
    const { password } = await sut.add(accountData);

    expect(hasherSpy).toHaveBeenCalledWith('valid_password');
    expect(password).toBe('hashed_password');
  });

  test('Should throw if Hasher throws an error', async () => {
    const { hasherStub, sut } = makeSut();

    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => {
      reject(new Error());
    }));

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    };

    await expect(async () => await sut.add(accountData)).rejects.toThrow();
  });

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@gmail.com',
      password: 'valid_password'
    };
    await sut.add(accountData);

    expect(addSpy).toHaveBeenCalledWith({
      ...accountData,
      password: 'hashed_password'
    });
  });

  test('Should throw if AddAccountRepository throws an error', async () => {
    const { addAccountRepositoryStub, sut } = makeSut();

    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => {
      reject(new Error());
    }));

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    };

    await expect(async () => await sut.add(accountData)).rejects.toThrow();
  });

  test('Should return an account on success', async () => {
    const { sut } = makeSut();
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@gmail.com',
      password: 'valid_password'
    };
    const account = await sut.add(accountData);

    expect(account).toStrictEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@gmail.com',
      password: 'hashed_password'
    });
  });
});
