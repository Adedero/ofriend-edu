import { config } from "dotenv";
import mongoose, { Document, model, Schema } from "mongoose";
import { db } from "../database/db-models";

config();

export interface FollowModel extends Document {
  user: Schema.Types.ObjectId;
  follower: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const followSchema = new Schema<FollowModel>({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    index: true
  },
  follower: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    index: true
  },
}, { timestamps: true });


followSchema.pre('save', { document: true, query: false }, async function (next) {
  const follow = this as FollowModel;
  if (process.env.NODE_ENV === 'production') {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      await db.User.updateOne({ _id: follow.user }, { $inc: { followersCount: 1 } }, { session });
      await db.User.updateOne({ _id: follow.follower }, { $inc: { followingCount: 1 } }, { session });
      await session.commitTransaction();
      session.endSession();
      next();
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error as Error);
    }
    return;
  }

  try {
    await Promise.all([
      db.User.updateOne({ _id: follow.user }, { $inc: { followersCount: 1 } }),
      db.User.updateOne({ _id: follow.follower }, { $inc: { followingCount: 1 } })
    ]);
    next();
  } catch (error) {
    next(error as Error);
  }
});


followSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  const follow = this as FollowModel;

  if (process.env.NODE_ENV === 'production') {
    const session = await mongoose.startSession();
    try {
      session.startTransaction(); 
      await db.User.updateOne({ _id: follow.user }, { $inc: { followersCount: -1 } }, { session });
      await db.User.updateOne({ _id: follow.follower }, { $inc: { followingCount: -1 } }, { session });
      await follow.deleteOne({ session });
      await session.commitTransaction();
      session.endSession();
      next();
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error as Error);
    }
    return;
  }

  try {
    await Promise.all([
      db.User.updateOne({ _id: follow.user }, { $inc: { followersCount: -1 } }),
      db.User.updateOne({ _id: follow.follower }, { $inc: { followingCount: -1 } })
    ]);
    next();
  } catch (error) {
    next(error as Error);
  }
});


followSchema.pre('deleteMany', async function (next) {
  const filter = this.getFilter();
  if (process.env.NODE_ENV === 'production') {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const followsToDelete = await this.model.find(filter);

      for (const follow of followsToDelete) {
        await db.User.updateOne({ _id: follow.user }, { $inc: { followersCount: -1 } }, { session });
        await db.User.updateOne({ _id: follow.follower }, { $inc: { followingCount: -1 } }, { session });
      }
      await session.commitTransaction();
      session.endSession();
      next();
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error as Error);
    }
    return;
  }

  try {
    const followsToDelete = await this.model.find(filter);

    await Promise.all(
      followsToDelete.map(follow => {
        return Promise.all([
          db.User.updateOne({ _id: follow.user }, { $inc: { followersCount: -1 } }),
          db.User.updateOne({ _id: follow.follower }, { $inc: { followingCount: -1 } })
        ]);
      })
    );
    next();
  } catch (error) {
    next(error as Error);
  }
});


const Follow = model<FollowModel>('Follow', followSchema);
export default Follow;
