import { config } from 'dotenv';
import transporter from '../config/nodemailer.config';

config();

interface MailerOptions {
  email: string;
  subject?: string;
  text?: string;
  html?: string
}

const FROM_EMAIL = process.env.EMAIL_USER || 'ofriend'
export default async function sendEmail(options: MailerOptions): Promise<null | Error> {
  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: options.email,
      subject: options.subject,
      text: options.text ?? '',
      html: options.html ?? ''
    });
    return null;
  } catch (err) {
    return err as Error;
  }
};