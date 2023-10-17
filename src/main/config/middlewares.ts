import { type Express } from 'express';
import { bodyParser, contentType, cors } from '../middlewares';

export const middlewaresConfig = (app: Express): void => {
  app.use(bodyParser);
  app.use(cors);
  app.use(contentType);
};
