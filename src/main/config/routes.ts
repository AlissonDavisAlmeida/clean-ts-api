/* eslint-disable n/no-path-concat */
import { type Express, Router } from 'express';
import { readdirSync } from 'fs';

export const routesConfig = (app: Express): void => {
  const router = Router();
  app.use('/api', router);
  readdirSync(`${__dirname}/../routes`).map(async file => {
    if (!file.includes('.test.')) {
      (await import(`../routes/${file}`)).default(router);
    }
  });
};
