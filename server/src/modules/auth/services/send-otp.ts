import type { Request, Response } from "express";
import Validator from "../../../validators/validator";
import { db } from "../../../database/db-models";
import { generateRandomPin, isPinExpired, setPinExpiryDate } from "../../../utils/pin-generator";
import sendEmail from '../../../utils/mailer';

export default async function sendOtpEmail(req: Request, res: Response) {
  const { user_id, email } = req.query;

  if (!user_id && !email) {
    res.status(400).json({ message: 'User ID or email is required' });
    return;
  }

  const [user, errorMessage] = await getUser(user_id as string, email as string);
  if (!user) {
    res.status(400).json({ message: errorMessage });
    return;
  }

  if (user.verified) {
    res.status(200).json({ message: 'User verified', user })
    return;
  }

  const PIN_EXPIRY_TIME = '1 hour';
  let otp = await db.OTP.findOne({ userId: user.id });
  if (!otp) {
    otp = await new db.OTP({
      userId: user.id,
      value: generateRandomPin(6),
      expiresAt: setPinExpiryDate(PIN_EXPIRY_TIME)
    }).save();
  }
  
  if (isPinExpired(otp.expiresAt)) {
    otp.value = parseInt(generateRandomPin(6));
    otp.expiresAt = setPinExpiryDate(PIN_EXPIRY_TIME);
    await otp.save();
  }

  const text = `Your secure OTP: ${otp.value}. Note that this password expires in ${PIN_EXPIRY_TIME}`;

  const mailError = await sendEmail({
    email: user.email,
    subject: 'Ofriend Account Verification',
    text
  });

  if (mailError) throw mailError;

  res.status(200).json({
    message: 'OTP email sent',
    user
  });
}



type GetUserReturnType = [
  null | { id: string; name: string; email: string; verified: boolean },
  null | string
]

async function getUser(userId: undefined | string, email: undefined | string): Promise<GetUserReturnType> {
  if (!userId && !email) {
    return [null, 'User ID or email is required'];
  }
  let message: string | null = '';
  if (userId) {
    const validatedId = validateId(userId);
    if (!validatedId.valid) {
      message = 'Invalid user ID'
      return [null, message];
    }
    const user = await db.User.findById(validatedId.value, { name: 1, email: 1, verified: 1 }).lean();
    if (!user) {
      message = 'User not found'
      return [null, message];
    }
    message = null;
    return [{ id: user.id, name: user.name, email: user.email, verified: user.verified }, message];
  }
  if (email) {
    const validatedEmail = validateEmail(email);
    if (!validatedEmail.valid) {
      message = 'Invalid email'
      return [null, message];
    }
    const user = await db.User.findOne({ email: validatedEmail.value }, { name: 1, email: 1, verified: 1 }).lean();
    if (!user) {
      message = 'No user with the provided email was found'
      return [null, message];
    }
    message = null;
    return [{ id: user.id, name: user.name, email: user.email, verified: user.verified }, message];
  }
  return [null, 'Invalid user ID or email']
}


function validateId(id: string) {
  const validatedId = new Validator(id)
    .string()
    .trim()
    .notEmpty()
    .objectId()
    .validate();
  return validatedId;
}

function validateEmail(email: string) {
  const validatedEmail = new Validator(email)
    .string()
    .trim()
    .notEmpty()
    .email()
    .validate();
  return validatedEmail;
}
