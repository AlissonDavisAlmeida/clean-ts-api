import { type LoadAccountByToken } from '@/@domain/useCases/account/loadAccountByToken';
import { LoadAccountByTokenUseCase } from './load-account-by-token';
import { type Decrypter } from '@/@data/protocols/criptography/decrypter';

type SutTypes = {
  sut: LoadAccountByToken
  decrypterStub: Decrypter
}

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
  const loadAccountByToken = new LoadAccountByTokenUseCase(decrypterStub);

  return {
    sut: loadAccountByToken,
    decrypterStub
  };
};

describe('LoadAccountByToken Usecase', () => {
  test('should call decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut();

    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt');

    await sut.load('any_token');

    expect(decryptSpy).toHaveBeenCalledWith('any_token');
  });

  test('should return null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut();

    jest.spyOn(decrypterStub, 'decrypt').mockResolvedValue(null);

    const account = await sut.load('any_token');

    expect(account).toBeNull();
  });
});
