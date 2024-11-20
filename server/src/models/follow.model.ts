import { Document, model, Schema } from "mongoose";

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

const Follow = model<FollowModel>('Follow', followSchema);
export default Follow;
