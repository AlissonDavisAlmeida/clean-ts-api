import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';
import { type HashComparerParams } from '@/@data/protocols/criptography';

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return new Promise((resolve) => { resolve('hash'); });
  },
  async compare (): Promise<boolean> {
    return new Promise((resolve) => { resolve(true); });
  }
}));

interface MakeSUT {
  sut: BcryptAdapter
  salt: number
}

const makeSut = (): MakeSUT => {
  const salt = 12;
  return {
    sut: new BcryptAdapter(salt),
    salt
  };
};

const makeFakeHashComparerParams = (): HashComparerParams => ({
  password: 'any_value',
  hashedPassword: 'any_hash'
});

describe('Bcrypt Adapter', () => {
  test('should call bcrypt hash with correct values', async () => {
    const { sut, salt } = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.hash('any_value');

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });

  test('should return a valid hash on hash method success', async () => {
    const { sut } = makeSut();

    const hash = await sut.hash('any_value');

    expect(hash).toBe('hash');
  });

  test('should throw if bcrypt throws ', async () => {
    const { sut } = makeSut();
    jest.spyOn<any, string>(bcrypt, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()); }));
    jest.spyOn<any, string>(bcrypt, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()); }));
    const hashPromise = sut.hash('any_value');
    await expect(hashPromise).rejects.toThrow();

    const comparePromise = sut.compare(makeFakeHashComparerParams());
    await expect(comparePromise).rejects.toThrow();
  });

  test('should call bcrypt compare with correct values', async () => {
    const { sut } = makeSut();
    const compareSpy = jest.spyOn(bcrypt, 'compare');
    const hashParams = makeFakeHashComparerParams();
    await sut.compare(hashParams);

    expect(compareSpy).toHaveBeenCalledWith(hashParams.password, hashParams.hashedPassword);
  });

  test('should return true on compare method success', async () => {
    const { sut } = makeSut();

    const hashParams = makeFakeHashComparerParams();
    const isSame = await sut.compare(hashParams);

    expect(isSame).toBeTruthy();
  });

  test('should return false if compare fails', async () => {
    const { sut } = makeSut();
    jest.spyOn<any, string>(bcrypt, 'compare').mockReturnValueOnce(new Promise((resolve) => { resolve(false); }));
    const hashParams = makeFakeHashComparerParams();
    const isSame = await sut.compare(hashParams);

    expect(isSame).toBeFalsy();
  });
});
