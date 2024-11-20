import { type NextFunction, Request, Response } from 'express';
import passport from '../config/passport.config';
import { type ExpressUser } from '../types/express-user.type';
import { ObjectId } from 'mongoose';

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', (err: null | Error, user: ExpressUser) => {
    if (err) {
      res.status(401).json({ message: err.message });
      return;
    }
    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    if (!user.verified) {
      res.status(403).json({ message: 'Account not verified' });
      return;
    }
    req.user = {
      ...user,
      id: (user._id as ObjectId).toString(),
      password: ''
    };
    next();
  })(req, res, next);
}

export default authenticate;