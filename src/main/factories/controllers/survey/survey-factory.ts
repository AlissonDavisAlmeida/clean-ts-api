import { SurveyMongoRepository, LogMongoRepository } from '@/infra/db/mongodb';
import { LogControllerDecorator } from '../../../decorators/log-controller.decorator';
import { AddSurveyController } from '../../../../presentation/controller/survey/add-survey/add-surveyController';
import { type Controller } from '../../../../presentation/protocols';
import { makeSurveyValidatorFactory } from './survey-validator-factory';
import { AddSurveyUseCase } from '@/@data/usecases/survey/add-survey/add-survey.usecase';
import { LoadSurveysUseCase } from '@/@data/usecases/survey/load-surveys/load-surveys.usecase';
import { LoadSurveysController } from '@/presentation/controller/survey/load-survey/load-surveysController';

export const makeAddSurveyController = (): Controller => {
  const accountMongoRepository = new SurveyMongoRepository();
  const addSurvey = new AddSurveyUseCase(accountMongoRepository);
  const validationComposite = makeSurveyValidatorFactory();
  const addSurveyController = new AddSurveyController(validationComposite, addSurvey);
  const logMongoRepository = new LogMongoRepository();
  const logControllerDecorator = new LogControllerDecorator(addSurveyController, logMongoRepository);
  return logControllerDecorator;
};

export const makeLoadSurveysController = (): Controller => {
  const surveyMongoRepository = new SurveyMongoRepository();
  const loadSurveys = new LoadSurveysUseCase(surveyMongoRepository);
  const loadSurveysController = new LoadSurveysController(loadSurveys);
  const logMongoRepository = new LogMongoRepository();
  const logControllerDecorator = new LogControllerDecorator(loadSurveysController, logMongoRepository);
  return logControllerDecorator;
};
