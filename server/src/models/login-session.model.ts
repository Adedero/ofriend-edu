import { Schema, model } from 'mongoose';

export interface LoginSessionModel {
  userId: Schema.Types.ObjectId; 
  token?: string;
  lastLogin?: Date;
  createdAt?: Date;
  ipAddresses: string[];
  userAgents: string[];
}

const loginSessionSchema = new Schema<LoginSessionModel>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String },
  lastLogin: { type: Date, default: Date.now },
  ipAddresses: { type: [String], default: [], required: true },
  userAgents: { type: [String], default: [], required: true },
}, { timestamps: true });

const LoginSession = model<LoginSessionModel>('LoginSession', loginSessionSchema);

export default LoginSession;