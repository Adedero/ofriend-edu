import { Model } from 'mongoose';
import User, { UserModel } from '../models/user.model';
import LoginSession, { LoginSessionModel } from '../models/login-session.model';
import OTP, { OTPModel } from '../models/otp.model';
import Post, { PostModel } from '../models/post.model';
import SavedPost, { SavedPostModel } from '../models/saved-post.model';
import Follow, { FollowModel } from '../models/follow.model';
import Like, { LikeModel } from '../models/like.model';
import Block, { BlockModel } from '../models/block.model';

interface Models {
  User: Model<UserModel>;
  LoginSession: Model<LoginSessionModel>;
  OTP: Model<OTPModel>;
  Post: Model<PostModel>;
  SavedPost: Model<SavedPostModel>;
  Follow: Model<FollowModel>;
  Like: Model<LikeModel>;
  Block: Model<BlockModel>;
};

export const db: Models = {
  User,
  LoginSession,
  OTP,
  Post,
  SavedPost,
  Follow,
  Like,
  Block
};

