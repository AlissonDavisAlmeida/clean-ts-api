import { type Validation, type HttpRequest } from '@/presentation/controller/account/signup/signup.protocols';
import { AddSurveyController } from './add-surveyController';
import { badRequest } from '@/presentation/helpers/httpHelper';
import { type AddSurvey } from '@/@domain/useCases/survey/add-survey';

interface SutTypes {
  sut: AddSurveyController
  validationStub: Validation
  addSurvey: AddSurvey
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null;
    }
  }

  return new ValidationStub();
};

const makeAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    add = async (data: any): Promise<void> => {};
  }

  return new AddSurveyStub();
};

const makeSut = (): SutTypes => {
  const validationStub = makeValidation();
  const addSurvey = makeAddSurvey();
  const sut = new AddSurveyController(validationStub, addSurvey);

  return {
    sut,
    validationStub,
    addSurvey
  };
};

const makeHttpRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      }
    ]
  }
});

describe('AddSurveyController', () => {
  it('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut();

    const validateSpy = jest.spyOn(validationStub, 'validate');

    const httpRequest = makeHttpRequest();

    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });
  it('should return badRequest 400 if Validation fails', async () => {
    const { sut, validationStub } = makeSut();

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error());

    const httpRequest = makeHttpRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new Error()));
  });

  it('should call AddSurvey usecase with correct values', async () => {
    const { sut, addSurvey } = makeSut();

    const addSurveySpy = jest.spyOn(addSurvey, 'add');

    const httpRequest = makeHttpRequest();

    await sut.handle(httpRequest);

    expect(addSurveySpy).toHaveBeenCalledWith(httpRequest.body);
  });
});
