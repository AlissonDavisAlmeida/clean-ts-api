import jwt from 'jsonwebtoken';
import { JWTAdapter } from './jwt-adapter';

const makeSut = (): JWTAdapter => {
  return new JWTAdapter();
};
describe('Jwt Adapter', () => {
  test('should calls sign method with correct values', async () => {
    const sut = makeSut();
    const id = 'any_id';
    const signSpy = jest.spyOn(jwt, 'sign');

    await sut.generate(id);

    expect(signSpy).toHaveBeenCalledWith({ id }, 'secret');
  });

  test('should throw if sign throws', async () => {
    const sut = makeSut();
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.generate('any_id');

    await expect(promise).rejects.toThrow();
  });
});
