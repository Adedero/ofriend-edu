import { Router } from 'express';
import AuthController from './controller';

const router = Router();

//router.get('/user', AuthController.getUser);
router.post('/sign-in', AuthController.signin);
router.post('/register', AuthController.register);
router.post('/otp/mail', AuthController.sendOtpEmail);
router.post('/account/verify', AuthController.verifyAccount);

export default router;