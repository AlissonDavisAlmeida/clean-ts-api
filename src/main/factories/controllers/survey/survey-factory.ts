import { SurveyMongoRepository, LogMongoRepository } from '@/infra/db/mongodb';
import { LogControllerDecorator } from '../../../decorators/log-controller.decorator';
import { AddSurveyController } from '../../../../presentation/controller/survey/add-survey/add-surveyController';
import { type Controller } from '../../../../presentation/protocols';
import { makeSurveyValidatorFactory } from './survey-validator-factory';
import { AddSurveyUseCase } from '@/@data/usecases/survey/add-survey/add-survey.usecase';

export const makeSurveyController = (): Controller => {
  const accountMongoRepository = new SurveyMongoRepository();
  const addSurvey = new AddSurveyUseCase(accountMongoRepository);
  const validationComposite = makeSurveyValidatorFactory();
  const loginController = new AddSurveyController(validationComposite, addSurvey);
  const logMongoRepository = new LogMongoRepository();
  const logControllerDecorator = new LogControllerDecorator(loginController, logMongoRepository);
  return logControllerDecorator;
};
