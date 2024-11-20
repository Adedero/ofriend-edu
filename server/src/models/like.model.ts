import { Document, model, Schema } from "mongoose";

export interface LikeModel extends Document {
  liker: Schema.Types.ObjectId;
  targetId: string;
  targetType: 'Post' | 'Comment';
  createdAt: Date;
  updatedAt: Date;
}

const likeSchema = new Schema<LikeModel>({
  liker: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    index: true
  },
  targetId: {
    type: String,
    required: true,
    index: true
  },
  targetType: {
    type: String,
    enum: ['Post', 'Comment'],
    required: true,
    index: true,
    default: 'Post'
  }
}, { timestamps: true });

const Like = model<LikeModel>('Like', likeSchema);
export default Like;
