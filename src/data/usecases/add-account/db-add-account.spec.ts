import { type Encrypter } from '../../protocols/encrypter';
import { DbAddAccount } from './db-add-account';

interface MakeSutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
}

const makeSut = (): MakeSutTypes => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => { resolve('hashed_password'); });
    }
  }

  const encrypterStub = new EncrypterStub();
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
});
