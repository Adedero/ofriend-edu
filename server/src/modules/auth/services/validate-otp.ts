import { Document } from 'mongoose';
import type { OTPModel } from '../../../models/otp.model';
import { db } from "../../../database/db-models";
import { isPinExpired } from "../../../utils/pin-generator";

interface OtpValidationReturnType {
  value: number;
  valid: boolean;
  message: string;
  model: null | Document & OTPModel
}
export default async function validateOtp(userId: string, otp: number): Promise<OtpValidationReturnType> {
  const existingOtp = await db.OTP.findOne({ userId });
  if (!existingOtp) {
    return {
      value: otp,
      valid: false,
      message: 'The OTP provided is invalid or expired. Sign in to generate a new one.',
      model: null
    }
  }

  if (isPinExpired(existingOtp.expiresAt)) {
    return {
      value: otp,
      valid: false,
      message: 'The OTP provided is invalid or expired. Sign in to generate a new one.',
      model: existingOtp
    }
  }

  const isOtpCorrect = (otp === existingOtp.value);
  if (!isOtpCorrect) {
    return {
      value: otp,
      valid: false,
      message: 'The OTP provided is incorrect. Check your email address and try again.',
      model: existingOtp
    }
  }

  return {
    value: otp,
    valid: true,
    message: 'OTP is valid and correct',
    model: existingOtp
  }
}
