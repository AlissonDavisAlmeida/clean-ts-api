import { type LogErrorRepository } from '../../data/protocols/log-error-repository';
import { serverError } from '../../presentation/helpers/httpHelper';
import { type HttpResponse, type Controller, type HttpRequest } from '../../presentation/protocols';
import { LogControllerDecorator } from './log';

const httpResponseStub: HttpResponse = {
  statusCode: 200,
  body: {
    name: 'valid_name',
    email: 'valid_email',
    password: 'valid_password',
    passwordConfirmation: 'valid_password'
  }
};

class ControllerStub implements Controller {
  async handle (_: HttpRequest): Promise<HttpResponse> {
    return new Promise(resolve => { resolve(httpResponseStub); });
  }
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log (stack: string): Promise<void> {
      return new Promise(resolve => { resolve(); });
    }
  }
  return new LogErrorRepositoryStub();
};

interface MakeSutProps {
  sut: LogControllerDecorator
  stubController: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): MakeSutProps => {
  const stubController = new ControllerStub();
  const logErrorRepositoryStub = makeLogErrorRepository();
  const sut = new LogControllerDecorator(stubController, logErrorRepositoryStub);

  return {
    sut,
    stubController,
    logErrorRepositoryStub
  };
};

describe('Log Decorator', () => {
  test('should call controller handle', async () => {
    const { stubController, sut } = makeSut();

    const handleSpy = jest.spyOn(stubController, 'handle');

    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'an@any_email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    };
    await sut.handle(httpRequest);

    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });

  test('should return the same result of the controller', async () => {
    const { sut } = makeSut();

    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'an@any_email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    };
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(httpResponseStub);
  });
  test('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, stubController, logErrorRepositoryStub } = makeSut();
    const fakeError = new Error();
    fakeError.stack = 'any_stack';
    const error = serverError(fakeError);
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log');

    jest.spyOn(stubController, 'handle').mockReturnValueOnce(new Promise(resolve => { resolve(error); }));

    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'an@any_email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    };
    await sut.handle(httpRequest);

    expect(logSpy).toHaveBeenCalledWith(fakeError.stack);
  });
});