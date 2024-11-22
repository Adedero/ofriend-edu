import { type Request, Response} from 'express';
import { ExpressUser } from '../../../../types/express-user.type';
import { db } from '../../../../database/db-models';
import { validateUserId } from '../../utils/validate-ids';
import mongoose from 'mongoose';
export default async function toggleFollow(req: Request, res: Response) {
  const followerId = (req.user as ExpressUser).id;

  const { user_id } = req.params;
  const validatedId = validateUserId(user_id);
  if (!validatedId.valid) {
    res.status(400).json({ message: validatedId.message });
    return;
  };
  const userId = validatedId.value;

  if (process.env.NODE_ENV === 'production') {
    const following = await toggleFollowInProductionEnv(userId, followerId);
    res.status(200).json({ following });
    return;
  }
  const following = await toggleFollowInDevEnv(userId, followerId);
  res.status(200).json({ following });
  return;
}


async function toggleFollowInDevEnv(userId: string, followerId: string) {
  const follow = await db.Follow.findOne({ user: userId, follower: followerId }).lean();

  if (follow) {
    await Promise.all([
      db.User.updateOne({ _id: userId }, { $inc: { followers: -1 } }),
      db.User.updateOne({ _id: followerId }, { $inc: { following: -1 } }),
      db.Follow.deleteOne({ user: userId })
    ]) ;
    return false;
  }

  await Promise.all([
    db.User.updateOne({ _id: userId }, { $inc: { followers: 1 } }),
    db.User.updateOne({ _id: followerId }, { $inc: { following: 1 } }),
    db.Follow.create({ user: userId, follower: followerId })
  ]);
  return true;
}


async function toggleFollowInProductionEnv(userId: string, followerId: string) {
  const follow = await db.Follow.findOne({ user: userId, follower: followerId }).lean();

  const session = await mongoose.startSession();
  session.startTransaction();

  if (follow) {
    await db.User.updateOne({ _id: userId }, { $inc: { followers: -1 } }, { session });
    await db.User.updateOne({ _id: followerId }, { $inc: { following: -1 } }, { session });
    await db.Follow.deleteOne({ user: userId }, { session });
    
    await session.commitTransaction();
    session.endSession();
    return false;
  }

  await db.User.updateOne({ _id: userId }, { $inc: { followers: 1 } }, { session });
  await db.User.updateOne({ _id: followerId }, { $inc: { following: 1 } }, { session });
  await db.Follow.create({ user: userId, follower: followerId }, { session });

  await session.commitTransaction();
  session.endSession();
  return true;
}