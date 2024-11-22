import dotenv from 'dotenv';
import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { db } from '../database/db-models';
dotenv.config();

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'jwt-secret'
};

type Callback = (error: Error | null, user: Record<string, unknown> | boolean) => void;

passport.use(new Strategy(jwtOptions, async (payload: { id: string }, done: Callback) => {
  try {
    const [ user, loginSession ] = await Promise.all([
      db.User.findById(payload.id).lean(),
      db.LoginSession.findOne({ user: payload.id }, { token: 1 }).lean()
    ]);
    if (!user || !loginSession) return done(null, false);
    const updatedUser = { ...user, token: loginSession.token };
    return done(null, updatedUser);
  } catch (error) {
    return done(error as Error, false)
  }
}))

export default passport;