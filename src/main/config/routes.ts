import { type Express, Router } from 'express';
import fastGlob from 'fast-glob';

export const routesConfig = (app: Express): void => {
  const router = Router();
  app.use('/api', router);
  fastGlob.sync('**/src/main/routes/*/**routes.ts').map(async file => {
    (await import(`../../../${file}`)).default(router);
  });
};
