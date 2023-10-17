import express from 'express';
import { middlewaresConfig } from './middlewares';
import { routesConfig } from './routes';

export const app = express();

middlewaresConfig(app);
routesConfig(app);
