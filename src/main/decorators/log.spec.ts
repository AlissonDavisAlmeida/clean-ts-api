import { type HttpResponse, type Controller, type HttpRequest } from '../../presentation/protocols';
import { LogControllerDecorator } from './log';

interface MakeSutProps {
  sut: LogControllerDecorator
  stubController: Controller
}

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

const makeSut = (): MakeSutProps => {
  const stubController = new ControllerStub();
  const sut = new LogControllerDecorator(stubController);

  return {
    sut,
    stubController
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
});
