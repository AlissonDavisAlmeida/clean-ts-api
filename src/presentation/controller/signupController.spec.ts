import { MissingParamError } from '../errors/MissingParamError';
import { SignupController } from './SignupController';

describe('Signup Controller', () => {
  test('should return 400 if no name is provided', async () => {
    const sut = new SignupController();
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    };
    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });
  test('should return 400 if no email is provided', async () => {
    const sut = new SignupController();
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    };
    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });
});
