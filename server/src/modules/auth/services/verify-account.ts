import type { Request, Response } from "express";
import { db } from "../../../database/db-models";
import validateOtp from './validate-otp';

export default async function verifyAccount (req: Request, res: Response) {
  const { user_id, otp } = req.query;
  if (!user_id && !otp) {
    res.status(400).json({ message: 'Verification failed. Try again later.' });
    return;
  }

  const user = await db.User.findById(user_id, { id: 1, verified: 1 });
  if (!user) {
    res.status(401).json({ message: 'User not found' });
    return;
  }
  if (user.verified) {
    res.status(200).json({ message: 'User verified', verified: user.verified })
    return;
  }

  const validatedOtp = await validateOtp(user_id as string, parseInt(otp as string));
  if (!validatedOtp.valid) {
    res.status(400).json({ message: validatedOtp.message });
    return;
  }
  user.verified = true;

  await Promise.all([
    user.save(),
    addCurrentIpAndUserAgent(user_id as string, req),
    db.OTP.deleteOne({ id: validatedOtp.model?.id })
  ]);

  res.status(200).json({ 
    message: 'Account verified',
    verified: user.verified,
  });
};

async function addCurrentIpAndUserAgent (userId: string, req: Request) {
  let session = await db.LoginSession.findOne({ user: userId });
  if (!session) {
    session = new db.LoginSession({
      user: userId,
      ipAddresses: [req.ip],
      userAgents: [req.headers['user-agent']]
    });
    await session.save();
    return;
  }

  const ipAddresses = new Set(session.ipAddresses);
  const userAgents = new Set(session.userAgents);

  ipAddresses.add(req.ip as string);
  userAgents.add(req.headers['user-agent'] as string);

  session.ipAddresses = Array.from(ipAddresses);
  session.userAgents = Array.from(userAgents);

  await session.save();
}