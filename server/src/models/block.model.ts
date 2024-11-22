import { Document, model, Schema } from "mongoose";
import { db } from "../database/db-models";

export interface BlockModel extends Document {
  blocker: Schema.Types.ObjectId | Record<string, unknown>;
  blockedUser: Schema.Types.ObjectId | Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const blockSchema = new Schema<BlockModel>({
  blocker: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    index: true
  },
  blockedUser: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    index: true
  },
}, { timestamps: true });

blockSchema.pre('save', async function (next) {
  const block = this as BlockModel;
  try {
    await db.Follow.deleteMany({
      $or: [
        { user: block.blocker, follower: block.blockedUser },
        { user: block.blockedUser, follower: block.blocker }
      ]
    });
    next();
  } catch (error) {
    next(error as Error);
  }
});

const Block = model<BlockModel>('Block', blockSchema);
export default Block;
