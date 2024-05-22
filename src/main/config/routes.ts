import { type Express, Router } from 'express';
import fastGlob from 'fast-glob';
import { config } from './env';

export const routesConfig = (app: Express): void => {
  const router = Router();
  app.use('/api', router);
  const sourceFolder = config.isProduction ? 'dist' : 'src';
  fastGlob.sync(`**/${sourceFolder}/main/routes/*/**routes.ts`).map(async file => {
    (await import(`../../../${file}`)).default(router);
  });
};
