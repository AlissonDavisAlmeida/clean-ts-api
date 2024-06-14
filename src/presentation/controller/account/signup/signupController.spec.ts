import { AccountAlreadyExistsError, MissingParamError } from '@/presentation/errors';
import { accountAlreadyExists, badRequest, ok, serverError } from '@/presentation/helpers/httpHelper';
import { SignupController } from './SignupController';
import {
  type Authentication,
  type AccountModel,
  type AddAccount,
  type AddAccountModel,
  type HttpRequest,
  type Validation,
  type AuthenticationParams
} from './signup.protocols';

interface SutTypes {
  sut: SignupController
  addAccountStub: AddAccount
  validationStub: Validation
  authenticationStub: Authentication
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = makeFakeAccount();

      return await new Promise(resolve => { resolve(fakeAccount); });
    }
  }

  return new AddAccountStub();
};

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth ({ email, password }: AuthenticationParams): Promise<string> {
      return await new Promise(resolve => { resolve('any_token'); });
    }
  }

  return new AuthenticationStub();
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null;
    }
  }

  return new ValidationStub();
};

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'any_name',
  email: 'valid@mail.com',
  password: 'any_password'
});

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount();
  const validationStub = makeValidation();
  const authenticationStub = makeAuthentication();
  const sut = new SignupController(addAccountStub, validationStub, authenticationStub);

  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub
  };
};

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'valid@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
});

describe('Signup Controller', () => {
  test('should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();
    const httpRequest = makeFakeRequest();

    const authSpy = jest.spyOn(authenticationStub, 'auth');

    await sut.handle(httpRequest);

    expect(authSpy).toHaveBeenCalledWith({
      email: httpRequest.body?.email,
      password: httpRequest.body?.password
    });
  });
  test('should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, 'add');

    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);

    expect(addSpy).toHaveBeenCalledWith({
      name: httpRequest.body.name,
      email: httpRequest.body.email,
      password: httpRequest.body.password
    });
  });

  test('should return 500 if addAccount throws an error', async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => { reject(new Error()); });
    });

    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('should returns 500 if Authentication throws an error', async () => {
    const { sut, authenticationStub } = makeSut();

    const httpRequest = makeFakeRequest();

    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('should return 403 if account already exists', async () => {
    const { sut, addAccountStub } = makeSut();

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => { reject(new AccountAlreadyExistsError()); });
    });

    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(accountAlreadyExists(new AccountAlreadyExistsError()));
  });

  test('should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(ok('any_token'));
  });

  test('should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut();

    const validateStubSpy = jest.spyOn(validationStub, 'validate');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);

    expect(validateStubSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test('should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut();
    const httpRequest = makeFakeRequest();

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'));

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')));
  });
});
