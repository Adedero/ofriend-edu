export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  verified: boolean;
  gender: 'female' | 'male' | 'other';
  birthday: Date;
  location: { country: string; region: string, address: string };
  bio?: string;
  address?: string;
  picture?: { url: string; name: string };
  banner?: { url: string; name: string };
  followersCount?: number;
  followingCount?: number;
  subscribersCount?: number;
  pushNotificationSubscription?: Record<string, string>;
  lastLogin: Date;
  nameHistory?: { isNameChanged: boolean; nameLastChangedAt: Date };
  createdAt: Date;
  updatedAt: Date;
  token: string;
}
