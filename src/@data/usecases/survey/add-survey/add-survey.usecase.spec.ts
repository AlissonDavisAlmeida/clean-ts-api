import { type AddSurveyParams, type AddSurvey } from '@/@domain/useCases/survey/add-survey';
import { AddSurveyUseCase } from './add-survey.usecase';
import { type AddSurveyRepository } from '@/@data/protocols/db/survey/add-survey.repository';
import MockDate from 'mockdate';

interface SutTypes {
  sut: AddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    add = async (): Promise<void> => {};
  }

  return new AddSurveyRepositoryStub();
};

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = makeAddSurveyRepository();
  const sut = new AddSurveyUseCase(addSurveyRepositoryStub);

  return {
    sut,
    addSurveyRepositoryStub
  };
};

const fakeSurveyData = (): AddSurveyParams => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer'
    }
  ],
  date: new Date()
});

describe('AddSurveyUseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();

    const data = fakeSurveyData();

    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add');

    await sut.add(data);

    expect(addSpy).toHaveBeenCalledWith(data);
  });

  test('should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();

    jest.spyOn(addSurveyRepositoryStub, 'add').mockImplementationOnce(async () => {
      throw new Error();
    });

    await expect(sut.add(fakeSurveyData())).rejects.toThrow();
  });
});
