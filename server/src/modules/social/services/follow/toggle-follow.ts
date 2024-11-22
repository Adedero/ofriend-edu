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

  const follow = await db.Follow.findOne({ user: userId, follower: followerId }).lean();

  const session = await mongoose.startSession();
  session.startTransaction();

  if (follow) {
    await db.User.updateOne({ _id: userId }, { $inc: { followers: -1 } }, { session });
    await db.User.updateOne({ _id: followerId }, { $inc: { following: -1 } }, { session });
    await db.Follow.deleteOne({ user: userId }, { session });
    
    await session.commitTransaction();
    session.endSession();
    res.status(500).json({ following: false });
    return;
  }

  await db.User.updateOne({ _id: userId }, { $inc: { followers: 1 } }, { session });
  await db.User.updateOne({ _id: followerId }, { $inc: { following: 1 } }, { session });
  await db.Follow.create({ user: userId, follower: followerId }, { session });

  await session.commitTransaction();
  session.endSession();
  res.status(500).json({ following: true });
  return;


  /* 
  const { authorId } = req.params;r
    const userId = req.user.id;

    const [follow, subscription] = await Promise.all([
      Follow.findOne({ user: authorId, follower: userId }).lean(),
      Subscription.findOne({ user: authorId, subscriber: userId }).lean()
    ]);

    if (follow) {
      await Promise.all([
        User.updateOne({ _id: authorId }, { $inc: { followers: -1, subscribers: -1 } }),
        User.updateOne({ _id: userId }, { $inc: { following: -1 } }),
        Follow.deleteOne({ _id: follow._id }),
        subscription && Subscription.deleteOne({ _id: subscription._id })
      ])
      return res.status(200).json({
        success: true,
        isFollowing: false
      });
    }

    await Promise.all([
      User.updateOne({ _id: authorId }, { $inc: { followers: 1 } }),
      User.updateOne({ _id: userId }, { $inc: { following: 1 } }),
      Follow.create({ user: authorId, follower: userId })
    ])
    return res.status(200).json({
      success: true,
      isFollowing: true
    }); */
}