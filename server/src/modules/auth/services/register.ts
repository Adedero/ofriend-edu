import { config } from 'dotenv';
import { type Request, Response } from "express";
import Validator from "../../../validators/validator";
import { db } from "../../../database/db-models";
import * as argon from 'argon2';
import isOldEnough from '../../../utils/age-checker';

config();

const MINIMUM_AGE_REQUIREMENT = 15;

interface Body {
  name: string;
  email: string;
  birthday: Date | null;
  gender: string;
  location: { country: string; region: string };
  password: { initial: string; repeat: string };
  hasAgreedToTerms: boolean;
}
export default async function register (req: Request, res: Response) {
  const validatedFields = validateFields(req.body as Body);

  const invalidKey = Object.keys(validatedFields).find(key => validatedFields[key].valid === false);
  if (invalidKey) {
    res.status(400).json({ message: validatedFields[invalidKey].message });
    return;
  }
  
  const { name, email, birthday, gender, country, region, password } = validatedFields;

  const existingUser = await db.User.findOne({ email: email.value }, { email: 1 }).lean();
  if (existingUser) {
    res.status(400).json({ message: 'A user with this email already exists. If this email is yours, try signing in instead.' });
    return;
  }
  const hashedPassword = await argon.hash(password.value as string);

  const user = new db.User({
    name: name.value,
    email: email.value,
    gender: gender.value,
    birthday: birthday.value,
    location: {
      country: country.value,
      region: region.value
    },
    password: hashedPassword,
    verified: false,
  });

  await user.save();

  res.status(200).json({
    message: 'Ofriend account created',
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  });
};

interface ValidatedField {
  valid: boolean;
  message: string;
  value: null | string | number | boolean | Date;
}

function validateFields(body: Body): Record<string, ValidatedField> {
  //const { name, email, birthday, gender, location, password, hasAgreedToTerms } = body;
  const name = new Validator(body.name)
    .string()
    .trim()
    .notEmpty({ message: 'Name cannot be empty'})
    .validate();
  
  const email = new Validator(body.email)
    .string()
    .trim()
    .notEmpty({ message: 'Name cannot be empty' })
    .email()
    .validate();
  
  const birthday = (function() {
    if (!body.birthday) return {
      value: body.birthday,
      valid: false,
      message: 'Birthday cannot be empty'
    }
    const valid = isOldEnough(body.birthday as Date, MINIMUM_AGE_REQUIREMENT);
    return {
      value: body.birthday,
      valid,
      message: valid? 'Validation passed' : `Must be at least ${MINIMUM_AGE_REQUIREMENT} years old`
    }
  })();

  const gender = new Validator(body.gender)
    .string()
    .lowercase()
    .enum(['female', 'male', 'other'], { message: 'Gender must be female, male, or other' })
    .validate();
  
  const country = new Validator(body.location.country)
    .string()
    .trim()
    .notEmpty({ message: 'Country cannot be empty' })
    .validate();

  const region = new Validator(body.location.region)
    .string()
    .trim()
    .notEmpty({ message: 'Region cannot be empty' })
    .validate();

  const password = (function() {
    const { initial, repeat } = body.password;
    const validatedPassword = new Validator(initial)
      .string()
      .trim()
      .notEmpty({ message: 'Password cannot be empty' })
      .min(8, { message: 'Password must be at least 8 characters long' })
      .validate();
    const validatedConfirmPassword = new Validator(repeat)
      .string()
      .trim()
      .equal(validatedPassword.value, { message: 'Passwords do not match' })
      .validate();

    return !validatedPassword.valid ? validatedPassword : validatedConfirmPassword
  })();

  const hasAgreedToTerms = new Validator(body.hasAgreedToTerms)
    .boolean()
    .true()
    .validate()
  
  return {
    name,
    email,
    birthday,
    gender,
    country,
    region,
    password,
    hasAgreedToTerms
  }

}
