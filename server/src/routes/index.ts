import { type Express } from 'express';

import authenticate from '../middleware/authenticate';

//Routes
import authRouter from '../modules/auth/routes';
import socialRouter from '../modules/social/routes';

export default function initializeRoutes(app: Express) {
  app.use('/auth', authRouter);
  app.use('/social', authenticate, socialRouter);
};