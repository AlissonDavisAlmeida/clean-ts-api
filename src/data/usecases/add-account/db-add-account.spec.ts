import { type Encrypter } from '../../protocols/encrypter';
import { DbAddAccount } from './db-add-account';

interface MakeSutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => { resolve('hashed_password'); });
    }
  }

  return new EncrypterStub();
};

const makeSut = (): MakeSutTypes => {
  const encrypterStub = makeEncrypter();
  const sut = new DbAddAccount(encrypterStub);

  return { sut, encrypterStub };
};

describe('DbAddAccount Usecase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { encrypterStub, sut } = makeSut();
    const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt');
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@gmail.com',
      password: 'valid_password'
    };
    const { password } = await sut.add(accountData);

    expect(encrypterSpy).toHaveBeenCalledWith('valid_password');
    expect(password).toBe('hashed_password');
  });

  test('Should throw if Encrypter throws an error', async () => {
    const { encrypterStub, sut } = makeSut();

    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => {
      reject(new Error());
    }));

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    };

    await expect(async () => await sut.add(accountData)).rejects.toThrow();
  });
});
