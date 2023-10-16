import express from 'express';
import { middlewaresConfig } from './middlewares';

export const app = express();

middlewaresConfig(app);
