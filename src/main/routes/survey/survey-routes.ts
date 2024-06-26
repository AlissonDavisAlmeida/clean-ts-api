import { type Router } from 'express';
import { adaptRoute } from '../../adapters/express/express-route-adapter';
import { makeSurveyController } from '@/main/factories/controllers/survey/survey-factory';

export default (router: Router): void => {
  router.post('/surveys', adaptRoute(makeSurveyController()));
};
