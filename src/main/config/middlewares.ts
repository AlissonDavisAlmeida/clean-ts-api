import { type Express } from 'express';
import { bodyParser } from '../middlewares/body-parser';
import { cors } from '../middlewares/cors';

export const middlewaresConfig = (app: Express): void => {
  app.use(bodyParser);
  app.use(cors);
};
