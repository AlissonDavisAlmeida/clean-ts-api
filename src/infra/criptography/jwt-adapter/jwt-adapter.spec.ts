import jwt from 'jsonwebtoken';
import { JWTAdapter } from './jwt-adapter';

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return 'any_token';
  },

  async verify (): Promise<string> {
    return 'any_value';
  }
}));

interface SutTypes {
  sut: JWTAdapter
  secret: string
}

const makeSut = (): SutTypes => {
  const secret = 'secret';
  return {
    sut: new JWTAdapter(secret),
    secret
  };
};
describe('Jwt Adapter', () => {
  describe('Encrypter protocol', () => {
    test('should calls sign method with correct values', async () => {
      const { sut, secret } = makeSut();
      const id = 'any_id';
      const signSpy = jest.spyOn(jwt, 'sign');

      await sut.generate(id);

      expect(signSpy).toHaveBeenCalledWith({ id }, secret);
    });

    test('should throw if sign throws', async () => {
      const { sut } = makeSut();
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error();
      });

      const promise = sut.generate('any_id');

      await expect(promise).rejects.toThrow();
    });

    test('should return a token on sign success', async () => {
      const { sut } = makeSut();
      const accessToken = await sut.generate('any_id');

      expect(accessToken).toBe('any_token');
    });
  });

  describe('Decrypter protocol', () => {
    test('should call verify with correct values', async () => {
      const { sut, secret } = makeSut();
      const verifySpy = jest.spyOn(jwt, 'verify');

      await sut.decrypt('any_token');

      expect(verifySpy).toHaveBeenCalledWith('any_token', secret);
    });

    test('should throw if verify throws', async () => {
      const { sut } = makeSut();
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new Error();
      });

      const promise = sut.decrypt('any_token');

      await expect(promise).rejects.toThrow();
    });

    test('should return a value on verify success', async () => {
      const { sut } = makeSut();
      const value = await sut.decrypt('any_token');

      expect(value).toBe('any_value');
    });
  });
});
