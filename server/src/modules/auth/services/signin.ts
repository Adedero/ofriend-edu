import { config } from 'dotenv';
import { type Request, Response } from "express";
import Validator from "../../../validators/validator";
import { db } from "../../../database/db-models";
import * as argon from 'argon2';
import * as jwt from 'jsonwebtoken';

config();

const JWT_SECRET = process.env.JWT_SECRET || 'jwt-secret';

interface Body { email: string; password: string }
export default async function signin (req: Request, res: Response) {
  //Implement rate limiting in production  
  const { email, password } = req.body as Body;

  const { validatedEmail, validatedPassword } = validateEmailAndPassword(email, password);
  if (!validatedEmail.valid) {
    res.status(400).json({ message: validatedEmail.message });
    return;
  }
  if (!validatedPassword.valid) {
    res.status(400).json({ message: validatedPassword.message });
    return;
  }

  const user = await db.User.findOne({ email: validatedEmail.value });
  if (!user) {
    res.status(400).json({ message: 'Email address not found' });
    return;
  }

  let session = await db.LoginSession.findOne({ userId: user._id });
  if (!session) {
    session = new db.LoginSession({
      userId: user._id,
      ipAddresses: [req.ip],
      userAgents: [req.headers['user-agent']],
    });
  }

  if (!await argon.verify(user.password, validatedPassword.value)) {
    res.status(400).json({ message: 'Incorrect password' });
    return;
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

  session.token = token;
  session.lastLogin = new Date(Date.now());
  await session.save();

  const isLoginSuspicious = 
    !session.ipAddresses.includes(req.ip as string) &&
    !session.userAgents.includes(req.headers['user-agent'] as string)

  if (isLoginSuspicious) {
    user.verified = false;
    await user.save();

    res.status(404).json({
      errorName: 'SuspiciousLoginAttemptError',
      message: 'This sign in attempt was flagged as suspicious. Further verification is needed'
    });
    return;
  }

  const authenticatedUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    gender: user.gender,
    location: user.location,
    picture: user.picture,
    verified: user.verified,
    createdAt: user.createdAt,
    bio: user.bio,
    token,
  }

  res.status(200).json({ message: 'Sign in successful', user: authenticatedUser });
}

function validateEmailAndPassword(email: string, password: string) {
  const validatedEmail = new Validator(email)
    .string()
    .trim()
    .notEmpty({ message: 'Email cannot be empty' })
    .email()
    .validate();

  const validatedPassword = new Validator(password)
    .string()
    .trim()
    .notEmpty({ message: 'Password cannot be empty' })
    .min(8, { message: 'Password must be at least 8 charcters' })
    .validate();
  return { validatedEmail, validatedPassword }
}
