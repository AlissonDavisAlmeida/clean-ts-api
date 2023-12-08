import { type HttpResponse, type Controller, type HttpRequest } from '../../presentation/protocols';
import { LogControllerDecorator } from './log';

interface MakeSutProps {
  sut: LogControllerDecorator
  controller: Controller
}

class ControllerStub implements Controller {
  async handle (_: HttpRequest): Promise<HttpResponse> {
    const httpResponse: HttpResponse = {
      statusCode: 200,
      body: {
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      }
    };
    return new Promise(resolve => { resolve(httpResponse); });
  }
}

const makeSut = (): MakeSutProps => {
  const stubController = new ControllerStub();
  const sut = new LogControllerDecorator(stubController);

  return {
    sut,
    controller: stubController
  };
};

describe('Log Decorator', () => {
  test('should call controller handle', async () => {
    const { controller, sut } = makeSut();

    const handleSpy = jest.spyOn(controller, 'handle');

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
});
