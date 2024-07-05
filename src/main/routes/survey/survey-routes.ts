import { type Router } from 'express';
import { adaptRoute } from '../../adapters/express/express-route-adapter';
import { makeSurveyController } from '@/main/factories/controllers/survey/survey-factory';
import { adaptMiddleware } from '@/main/adapters/express/express-middleware-adapter';
import { makeAuthMiddleware } from '@/main/factories/middlewares/auth-middleware-factory';

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'));
  router.post('/surveys', adminAuth, adaptRoute(makeSurveyController()));
};
