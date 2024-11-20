import { UserModel } from "../models/user.model";

export interface ExpressUser extends UserModel {
  token: string | undefined
}