import { Schema, model, Document } from 'mongoose';

export interface UserModel extends Document {
  name: string;
  email: string;
  password: string;
  verified: boolean;
  gender: 'female' | 'male' | 'other';
  birthday: Date;
  location: { country: string; region: string; address?: string };
  bio?: string;
  picture?: { url: string; name: string };
  banner?: { url: string; name: string };
  followersCount?: number;
  followingCount?: number;
  subscribersCount?: number;
  pushNotificationSubscription?: Record<string, string>;
  online: boolean;
  nameHistory?: { isNameChanged: boolean; nameLastChangedAt: Date };
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserModel>({
  name: { type: String, required: true, index: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true, minLength: 6, maxLength: 1024 },
  verified: { type: Boolean, required: true, default: false },
  gender: { type: String, enum: ['female', 'male', 'other'], required: true },
  birthday: { type: Date, required: true },
  bio: { type: String, required: false },
  location: { type: { country: String, region: String, address: String }, required: true },
  picture: { type: { url: String, name: String }, required: false },
  banner: { type: { url: String, name: String }, required: false },
  followersCount: { type: Number, required: false, default: 0 },
  followingCount: { type: Number, required: false, default: 0 },
  subscribersCount: { type: Number, required: false, default: 0 },
  pushNotificationSubscription: { type: Object, required: false },
  online: { type: Boolean, required: true, default: false },
  nameHistory: {
    isNameChanged: { type: Boolean, required: false },
    nameLastChangedAt: { type: Date, required: false }
  }
}, { timestamps: true });

const User = model<UserModel>('User', userSchema);
export default User;
