import signin from "./services/signin";
import register from "./services/register";
import sendOtpEmail from "./services/send-otp";
import verifyAccount from "./services/verify-account";


const AuthController = {
  signin,
  register,
  sendOtpEmail,
  verifyAccount
};

export default AuthController;