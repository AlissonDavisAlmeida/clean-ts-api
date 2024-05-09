import jwt from 'jsonwebtoken';
import { JWTAdapter } from './jwt-adapter';

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return 'any_token';
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
