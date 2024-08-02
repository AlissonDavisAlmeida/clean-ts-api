import { type SurveyModel } from '@/@domain/models/SurveyModel';
import { LoadSurveysController } from './load-surveysController';
import { type LoadSurveys } from '@/@domain/useCases/survey/load-survey';
import { ok, serverError } from '@/presentation/helpers/httpHelper';
import MockDate from 'mockdate';

type SutTypes = {
  sut: LoadSurveysController
  loadSurveysStub: LoadSurveys

}

const makeFakeSurveys = (): SurveyModel[] => {
  return [
    {
      id: 'any_id',
      question: 'any_question',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer'
        }
      ],
      date: new Date()
    },
    {
      id: 'other_id',
      question: 'other_question',
      answers: [
        {
          image: 'other_image',
          answer: 'other_answer'
        }
      ],
      date: new Date()
    }
  ];
};

const makeLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return new Promise(resolve => { resolve(makeFakeSurveys()); });
    }
  }

  return new LoadSurveysStub();
};

const makeSut = (): SutTypes => {
  const loadSurveysStub = makeLoadSurveys();
  const sut = new LoadSurveysController(loadSurveysStub);

  return {
    sut,
    loadSurveysStub
  };
};

describe('LoadSurveysController', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });
  test('should call LoadSurveys', async () => {
    const { loadSurveysStub, sut } = makeSut();
    const loadSpy = jest.spyOn(loadSurveysStub, 'load');
    await sut.handle({});

    expect(loadSpy).toHaveBeenCalled();
  });

  test('should return 200 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(ok(makeFakeSurveys()));
  });

  test('should return 500 if LoadSurveys throws', async () => {
    const { sut, loadSurveysStub } = makeSut();
    jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()); }));
    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
